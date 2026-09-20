import { NextResponse } from "next/server";
import { obtenerDisponibilidad } from "@/lib/google-calendar";
import { SERVICIOS, duracionDe } from "@/lib/datos";

export const dynamic = "force-dynamic";

/** GET /api/disponibilidad?fecha=YYYY-MM-DD&servicio=id */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fecha = searchParams.get("fecha");
  const servicioId = searchParams.get("servicio");
  const modalidad = searchParams.get("modalidad") ?? "presencial";
  const sede = searchParams.get("sede") ?? "talca";

  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
  }

  const servicio = SERVICIOS.find((s) => s.id === servicioId);
  if (!servicio) {
    return NextResponse.json({ error: "Servicio no encontrado" }, { status: 400 });
  }

  try {
    const bloques = await obtenerDisponibilidad(
      fecha,
      duracionDe(servicio, modalidad),
      modalidad,
      sede
    );
    return NextResponse.json({ fecha, bloques });
  } catch (e) {
    const err = e as { message?: string; code?: number; errors?: { reason?: string }[] };
    console.error("[DISPONIBILIDAD] falló:", {
      mensaje: err?.message,
      codigo: err?.code,
      motivo: err?.errors?.[0]?.reason,
    });
    return NextResponse.json(
      { error: "No se pudo consultar la disponibilidad" },
      { status: 502 }
    );
  }
}
