import { NextResponse } from "next/server";
import { estaConfigurado, estaAutorizado, verificarAcceso } from "@/lib/google-auth";
import { envioActivo } from "@/lib/correo";

export const dynamic = "force-dynamic";

/**
 * GET /api/google/estado
 * Diagnóstico rápido de qué integraciones están activas.
 * No expone ningún valor secreto.
 */
export async function GET() {
  // Prueba real contra Google: es la única forma de ver por qué falla
  let prueba: Record<string, string> = { estado: "no se intentó" };
  if (estaAutorizado()) {
    try {
      const { clienteCalendario } = await import("@/lib/google-auth");
      const cal = clienteCalendario();
      const hoy = new Date().toISOString().slice(0, 10);
      const { data } = await cal.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
        timeMin: `${hoy}T00:00:00-03:00`,
        timeMax: `${hoy}T23:59:59-03:00`,
        singleEvents: true,
        maxResults: 5,
      });
      prueba = {
        estado: "✓ Google respondió",
        eventosHoy: String(data.items?.length ?? 0),
        titulos: (data.items ?? []).map((e) => e.summary ?? "(sin título)").join(" · ") || "ninguno",
      };
    } catch (e) {
      const err = e as { message?: string; code?: number; errors?: { reason?: string }[] };
      prueba = {
        estado: "✗ Google rechazó la consulta",
        mensaje: err?.message ?? String(e),
        codigo: String(err?.code ?? "—"),
        motivo: err?.errors?.[0]?.reason ?? "—",
      };
    }
  }

  const acceso = await verificarAcceso();
  const calendarioListo = acceso.ok;

  // Diagnóstico: qué variables llegan al proceso, sin revelar sus valores
  const variables = Object.fromEntries(
    [
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "GOOGLE_REDIRECT_URI",
      "GOOGLE_CALENDAR_ID",
      "GOOGLE_REFRESH_TOKEN",
      "RESEND_API_KEY",
      "EMAIL_DESDE",
    ].map((n) => {
      const v = process.env[n];
      return [
        n,
        v
          ? `presente (${v.length} caracteres, empieza con "${v.slice(0, 6)}…")`
          : "AUSENTE",
      ];
    })
  );

  return NextResponse.json({
    prueba,
    variables,
    calendario: {
      credenciales: estaConfigurado(),
      autorizado: calendarioListo,
      calendarioId: process.env.GOOGLE_CALENDAR_ID || "primary",
      estado: calendarioListo
        ? "Conectado: la disponibilidad sale del calendario real"
        : !estaConfigurado()
          ? "Faltan las credenciales de Google en las variables de entorno"
          : !estaAutorizado()
            ? "Falta autorizar. Visita /api/google/auth con la cuenta de Salud Femme"
            : `Google rechaza el token: ${"detalle" in acceso ? acceso.detalle : ""}`,
      motivoFallo: "motivo" in acceso ? acceso.motivo : null,
    },
    correos: {
      activo: envioActivo(),
      estado: envioActivo()
        ? "Los correos se envían de verdad"
        : "Sin envío real: se registran en consola",
    },
  });
}
