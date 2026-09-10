import { NextResponse } from "next/server";
import { estaConfigurado, estaAutorizado } from "@/lib/google-auth";
import { envioActivo } from "@/lib/correo";

export const dynamic = "force-dynamic";

/**
 * GET /api/google/estado
 * Diagnóstico rápido de qué integraciones están activas.
 * No expone ningún valor secreto.
 */
export async function GET() {
  const calendarioListo = estaAutorizado();

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
    variables,
    calendario: {
      credenciales: estaConfigurado(),
      autorizado: calendarioListo,
      calendarioId: process.env.GOOGLE_CALENDAR_ID || "primary",
      estado: calendarioListo
        ? "Conectado: la disponibilidad sale del calendario real"
        : estaConfigurado()
          ? "Falta autorizar. Visita /api/google/auth con la cuenta de Salud Femme"
          : "Faltan las credenciales de Google en las variables de entorno",
    },
    correos: {
      activo: envioActivo(),
      estado: envioActivo()
        ? "Los correos se envían de verdad"
        : "Sin envío real: se registran en consola",
    },
  });
}
