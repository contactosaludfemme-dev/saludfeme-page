import { NextResponse } from "next/server";
import { SERVICIOS, duracionDe } from "@/lib/datos";
import { usaCalendarioReal } from "@/lib/google-calendar";
import { clienteCalendario } from "@/lib/google-auth";
import { esBloqueDisponible, aIntervalos, calcularBloques } from "@/lib/disponibilidad";
import { claveFecha, tieneCupo, ZONA, VENTANA_DIAS } from "@/lib/calendario";

export const dynamic = "force-dynamic";

/**
 * GET /api/dias-disponibles?mes=YYYY-MM&servicio=id&modalidad=presencial
 *
 * Devuelve qué días del mes tienen al menos una hora libre. El calendario
 * necesita saberlo para marcar los días con cupo, y consultarlo día por día
 * serían 30 peticiones: esta ruta pide el mes completo de una vez.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mes = searchParams.get("mes");
  const servicioId = searchParams.get("servicio");
  const modalidad = searchParams.get("modalidad") ?? "presencial";

  if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
    return NextResponse.json({ error: "Mes inválido" }, { status: 400 });
  }

  const servicio = SERVICIOS.find((s) => s.id === servicioId);
  if (!servicio) {
    return NextResponse.json({ error: "Servicio no encontrado" }, { status: 400 });
  }

  const duracion = duracionDe(servicio, modalidad);
  const [año, m] = mes.split("-").map(Number);
  const ultimoDia = new Date(año, m, 0).getDate();

  const limite = new Date();
  limite.setDate(limite.getDate() + VENTANA_DIAS);

  // Sin calendario conectado: reglas de respaldo
  if (!usaCalendarioReal()) {
    const dias: string[] = [];
    for (let d = 1; d <= ultimoDia; d++) {
      const fecha = new Date(año, m - 1, d);
      if (fecha > limite) break;
      const clave = claveFecha(fecha);
      if (tieneCupo(clave, duracion)) dias.push(clave);
    }
    return NextResponse.json({ mes, dias, fuente: "respaldo" });
  }

  try {
    // Una sola consulta para todo el mes
    const calendar = clienteCalendario();
    const { data } = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      timeMin: `${mes}-01T00:00:00-04:00`,
      timeMax: `${mes}-${String(ultimoDia).padStart(2, "0")}T23:59:59-04:00`,
      singleEvents: true,
      orderBy: "startTime",
      timeZone: ZONA,
      maxResults: 2500,
    });

    const eventos = data.items ?? [];
    const desde = new Date(Date.now() + 12 * 3600_000);

    // Agrupar los eventos por día
    const porDia = new Map<string, { abiertos: typeof eventos; ocupados: typeof eventos }>();
    for (const ev of eventos) {
      const inicio = ev.start?.dateTime;
      if (!inicio) continue;
      const clave = claveFecha(new Date(inicio));
      if (!porDia.has(clave)) porDia.set(clave, { abiertos: [], ocupados: [] });
      const grupo = porDia.get(clave)!;
      if (esBloqueDisponible(ev.summary)) grupo.abiertos.push(ev);
      else grupo.ocupados.push(ev);
    }

    const dias: string[] = [];
    for (const [clave, grupo] of porDia) {
      if (grupo.abiertos.length === 0) continue;
      if (new Date(clave) > limite) continue;
      const bloques = calcularBloques(
        aIntervalos(grupo.abiertos),
        aIntervalos(grupo.ocupados),
        duracion,
        30,
        desde
      );
      if (bloques.some((b) => b.libre)) dias.push(clave);
    }

    return NextResponse.json({ mes, dias: dias.sort(), fuente: "calendario" });
  } catch {
    return NextResponse.json(
      { error: "No se pudo consultar el calendario" },
      { status: 502 }
    );
  }
}
