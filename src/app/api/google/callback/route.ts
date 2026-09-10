import { NextResponse } from "next/server";
import { clienteOAuth, estaConfigurado } from "@/lib/google-auth";

export const dynamic = "force-dynamic";

/** Página de resultado, para no mostrar JSON crudo a quien autoriza. */
function pagina(titulo: string, cuerpo: string, exito: boolean) {
  const acento = exito ? "#1B8146" : "#D94A3D";
  const fondo = exito ? "#EAF5EE" : "#FDEFEC";
  return new NextResponse(
    `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titulo} · Salud Femme</title>
<style>
  body{margin:0;padding:2rem 1.25rem;background:#FDF2F4;
    font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#2E2A2B;line-height:1.6}
  .caja{max-width:36rem;margin:2rem auto;background:#fff;border-radius:18px;
    padding:2rem;box-shadow:0 6px 24px rgba(196,30,117,.10)}
  h1{margin:0 0 .5rem;font-size:1.4rem;color:${acento}}
  p{margin:0 0 1rem;font-size:.95rem}
  .aviso{background:${fondo};border-radius:12px;padding:1rem;font-size:.9rem}
  code{display:block;background:#2E2A2B;color:#F0EAEB;padding:1rem;border-radius:10px;
    font-size:.8rem;word-break:break-all;margin:.75rem 0;line-height:1.5}
  ol{padding-left:1.2rem;font-size:.92rem} li{margin-bottom:.5rem}
</style></head><body><div class="caja">${cuerpo}</div></body></html>`,
    { status: exito ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

/**
 * GET /api/google/callback
 *
 * Google redirige aquí después de que la matrona concede el permiso.
 * Intercambia el código por un refresh token y lo muestra para guardarlo
 * en las variables de entorno de Vercel.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const codigo = searchParams.get("code");
  const error = searchParams.get("error");

  if (!estaConfigurado()) {
    return pagina(
      "Falta configuración",
      `<h1>Falta configurar las credenciales</h1>
       <p>Antes de autorizar hay que definir estas variables de entorno en Vercel:</p>
       <code>GOOGLE_CLIENT_ID<br>GOOGLE_CLIENT_SECRET<br>GOOGLE_REDIRECT_URI</code>
       <p class="aviso">Se obtienen en Google Cloud Console, al crear las
       credenciales OAuth 2.0 del proyecto.</p>`,
      false
    );
  }

  if (error) {
    return pagina(
      "Autorización cancelada",
      `<h1>No se concedió el permiso</h1>
       <p>Google respondió: <strong>${error.replace(/[<>&]/g, "")}</strong></p>
       <p class="aviso">Puedes intentarlo otra vez entrando a
       <strong>/api/google/auth</strong> con la sesión de
       contacto.saludfemme@gmail.com abierta.</p>`,
      false
    );
  }

  if (!codigo) {
    return pagina(
      "Enlace incompleto",
      `<h1>Esta página no se abre directamente</h1>
       <p>Es el punto de retorno de Google, y necesita el código que
       entrega al autorizar.</p>
       <p class="aviso">Para conectar el calendario, entra a
       <strong>/api/google/auth</strong> con la sesión de
       contacto.saludfemme@gmail.com abierta.</p>`,
      false
    );
  }

  try {
    const { tokens } = await clienteOAuth().getToken(codigo);

    if (!tokens.refresh_token) {
      return pagina(
        "Sin token de larga duración",
        `<h1>Google no entregó el refresh token</h1>
         <p>Suele pasar cuando la cuenta ya había autorizado antes.</p>
         <p class="aviso">Revoca el acceso en
         <strong>myaccount.google.com/permissions</strong> y vuelve a entrar
         a <strong>/api/google/auth</strong>.</p>`,
        false
      );
    }

    return pagina(
      "Calendario conectado",
      `<h1>✓ Autorización concedida</h1>
       <p>Falta un último paso para dejarlo activo:</p>
       <ol>
         <li>Copia este valor:</li>
       </ol>
       <code>${tokens.refresh_token}</code>
       <ol start="2">
         <li>En Vercel, entra a <strong>Settings → Environment Variables</strong></li>
         <li>Crea <strong>GOOGLE_REFRESH_TOKEN</strong> y pega el valor</li>
         <li>Vuelve a desplegar el sitio</li>
       </ol>
       <p class="aviso"><strong>Guárdalo en un lugar seguro y no lo compartas.</strong>
       Da acceso al calendario de Salud Femme. Esta página no lo almacena:
       si la cierras sin copiarlo, hay que autorizar de nuevo.</p>`,
      true
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return pagina(
      "No se pudo completar",
      `<h1>No se pudo canjear el código</h1>
       <p>${msg.replace(/[<>&]/g, "")}</p>
       <p class="aviso">Revisa que <strong>GOOGLE_REDIRECT_URI</strong> sea
       exactamente igual a la URI registrada en Google Cloud Console, y que
       el código no haya expirado (dura pocos minutos).</p>`,
      false
    );
  }
}
