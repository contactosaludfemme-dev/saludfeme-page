import { NextResponse } from "next/server";
import { obtenerDisponibilidad } from "@/lib/google-calendar";
import { SERVICIOS } from "@/lib/datos";

export const dynamic = "force-dynamic";

/** GET /api/disponibilidad?fecha=YYYY-MM-DD&servicio=id */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fecha = searchParams.get("fecha");
  const servicioId = searchParams.get("servicio");

  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
  }

  const servicio = SERVICIOS.find((s) => s.id === servicioId);
  if (!servicio) {
    return NextResponse.json({ error: "Servicio no encontrado" }, { status: 400 });
  }

  try {
    const bloques = await obtenerDisponibilidad(fecha, servicio.duracion);
    return NextResponse.json({ fecha, bloques });
  } catch {
    return NextResponse.json(
      { error: "No se pudo consultar la disponibilidad" },
      { status: 502 }
    );
  }
}
