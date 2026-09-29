import { NextResponse } from "next/server";
import { leerToken } from "@/lib/firma";
import { rechazarEvento } from "@/lib/google-calendar";
import { correoRechazo, enviarUno } from "@/lib/correo";
import { liberar } from "@/lib/reservas";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.token) {
    return NextResponse.json({ error: "Falta el token." }, { status: 400 });
  }

  const cita = leerToken(body.token, "rechazar");
  if (!cita) {
    return NextResponse.json({ error: "Enlace no válido." }, { status: 403 });
  }

  try {
    const r = await rechazarEvento(cita.id);
    if (r.yaResuelta) {
      return NextResponse.json({ ok: true, yaResuelta: true });
    }

    // La hora vuelve a estar disponible para otras pacientes
    liberar(cita.fecha, cita.hora);

    if (r.datos?.email) {
      await enviarUno(
        correoRechazo(
          { nombre: r.datos.paciente, email: r.datos.email },
          { servicio: r.datos.servicio, fecha: cita.fecha, hora: cita.hora },
          typeof body.motivo === "string" ? body.motivo.slice(0, 300) : undefined
        )
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const codigo = (e as { code?: number })?.code;
    if (codigo === 404 || codigo === 410) {
      // Ya no está en el calendario: para la matrona el resultado es el mismo
      return NextResponse.json({ ok: true, yaResuelta: true });
    }
    console.error("[CITA] No se pudo rechazar:", e);
    return NextResponse.json(
      { error: "No pudimos completar la acción." },
      { status: 500 }
    );
  }
}
