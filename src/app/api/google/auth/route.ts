import { NextResponse } from "next/server";
import { clienteOAuth, estaConfigurado, ALCANCES } from "@/lib/google-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/google/auth
 *
 * Punto de partida de la autorización. Se visita una sola vez, con la
 * sesión de contacto.saludfemme@gmail.com abierta, y redirige a Google
 * para conceder el permiso.
 */
export async function GET() {
  if (!estaConfigurado()) {
    return NextResponse.json(
      {
        error: "Falta configurar las credenciales de Google.",
        detalle:
          "Define GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET y GOOGLE_REDIRECT_URI en las variables de entorno.",
      },
      { status: 503 }
    );
  }

  const url = clienteOAuth().generateAuthUrl({
    access_type: "offline", // necesario para recibir refresh_token
    prompt: "consent", // fuerza la entrega del token aunque ya se haya autorizado
    scope: ALCANCES,
    include_granted_scopes: true,
  });

  return NextResponse.redirect(url);
}
