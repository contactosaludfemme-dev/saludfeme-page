/**
 * Integración con Google Calendar.
 *
 * CÓMO SE ADMINISTRA LA AGENDA
 * Francisca abre horas creando eventos titulados "DISPONIBLE" en el
 * calendario de contacto.saludfemme@gmail.com. Este módulo los lee, los
 * parte según la duración del servicio y descuenta lo que ya esté ocupado.
 *
 * MODO DEMO vs. REAL
 * Si faltan las credenciales (GOOGLE_REFRESH_TOKEN y compañía), el sitio
 * sigue funcionando con disponibilidad simulada. En cuanto se configuran,
 * pasa a usar el calendario real sin tocar el código.
 *
 * Para conectarlo:
 *   1. Google Cloud Console → nuevo proyecto → habilitar Google Calendar API
 *   2. Credenciales OAuth 2.0 (aplicación web), con esta URI de redirección:
 *        https://TU-DOMINIO/api/google/callback
 *   3. Cargar en Vercel: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
 *      GOOGLE_REDIRECT_URI y GOOGLE_CALENDAR_ID
 *   4. Visitar /api/google/auth con la sesión de Salud Femme abierta
 *   5. Guardar el GOOGLE_REFRESH_TOKEN que entrega y redesplegar
 */

import { bloquesDelDia, ZONA, offsetChile, type Bloque } from "./calendario";
import { tomadasDelDia } from "./reservas";
import { estaAutorizado, clienteCalendario } from "./google-auth";
import {
  calcularBloques,
  aIntervalos,
  esBloqueDisponible,
  bloqueSirvePara,
} from "./disponibilidad";

/** Anticipación mínima para reservar, en horas. */
const ANTICIPACION_HORAS = 12;

/** ¿Está funcionando contra el calendario real? */
export function usaCalendarioReal(): boolean {
  return estaAutorizado();
}

type Cita = {
  servicio: string;
  duracionMin: number;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm
  paciente: { nombre: string; email: string; telefono: string; notas?: string };
  modalidad: string;
  /** Se guardan en el evento para poder pedirlos al confirmar el pago. */
  precio?: number;
  codigoReserva?: string;
};

/** Suma minutos a "YYYY-MM-DDTHH:mm:00" respetando la hora local. */
function sumarMinutos(fecha: string, hora: string, minutos: number): string {
  const [y, m, d] = fecha.split("-").map(Number);
  const [hh, mm] = hora.split(":").map(Number);
  const t = new Date(y, m - 1, d, hh, mm);
  t.setMinutes(t.getMinutes() + minutos);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}T${p(
    t.getHours()
  )}:${p(t.getMinutes())}:00`;
}

/**
 * Horas ofrecibles de un día.
 * Con el calendario conectado salen de sus bloques "DISPONIBLE"; sin él,
 * de las reglas de respaldo.
 */
export async function obtenerDisponibilidad(
  fecha: string,
  duracionMin: number,
  modalidad = "presencial",
  sede = "talca"
): Promise<Bloque[]> {
  if (!usaCalendarioReal()) {
    // Respaldo: horario genérico menos lo reservado en esta sesión
    const tomadas = tomadasDelDia(fecha);
    return bloquesDelDia(fecha, duracionMin).map((b) =>
      tomadas.has(b.hora) ? { ...b, libre: false } : b
    );
  }

  const calendar = clienteCalendario();
  const { data } = await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    timeMin: `${fecha}T00:00:00${offsetChile(fecha)}`,
    timeMax: `${fecha}T23:59:59${offsetChile(fecha)}`,
    singleEvents: true, // expande los eventos que se repiten
    orderBy: "startTime",
    timeZone: ZONA,
  });

  const eventos = data.items ?? [];
  // Solo los bloques de la sede elegida; los que no declaran sede sirven
  // para todas.
  const abiertos = aIntervalos(
    eventos.filter(
      (e) =>
        esBloqueDisponible(e.summary) &&
        bloqueSirvePara(e.summary, modalidad, sede)
    )
  );
  const ocupados = aIntervalos(
    eventos.filter((e) => !esBloqueDisponible(e.summary))
  );

  const desde = new Date(Date.now() + ANTICIPACION_HORAS * 3600_000);
  // Paso igual a la duración: las horas ofrecidas no se solapan, así una
  // reserva no invalida las tres siguientes.
  return calcularBloques(abiertos, ocupados, duracionMin, duracionMin, desde);
}

/**
 * Crea el evento de la cita en el calendario e invita a la paciente.
 * En modo demo devuelve datos simulados.
 */
export async function crearEvento(
  cita: Cita
): Promise<{ eventoId: string; meetUrl?: string; htmlLink?: string }> {
  if (!usaCalendarioReal()) {
    const id = `demo_${cita.fecha.replace(/-/g, "")}_${cita.hora.replace(":", "")}`;
    return {
      eventoId: id,
      meetUrl: cita.modalidad.toLowerCase().includes("online")
        ? `https://meet.google.com/demo-${id.slice(-6)}`
        : undefined,
      htmlLink: `https://calendar.google.com/calendar/event?eid=${id}`,
    };
  }

  const calendar = clienteCalendario();
  const esOnline = cita.modalidad.toLowerCase().includes("online");
  const inicio = `${cita.fecha}T${cita.hora}:00`;
  const fin = sumarMinutos(cita.fecha, cita.hora, cita.duracionMin);

  const { data } = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    conferenceDataVersion: esOnline ? 1 : 0,
    // La paciente no recibe invitación todavía: la cita está por confirmar.
    // Google la enviará al aceptarla, desde `confirmarEvento`.
    sendUpdates: "none",
    requestBody: {
      summary: `⏳ POR CONFIRMAR — ${cita.servicio} — ${cita.paciente.nombre}`,
      colorId: "6", // naranja: se distingue de las citas ya aceptadas
      description:
        `Servicio: ${cita.servicio}\n` +
        `Paciente: ${cita.paciente.nombre}\n` +
        `Teléfono: ${cita.paciente.telefono}\n` +
        `Email: ${cita.paciente.email}\n` +
        `Modalidad: ${cita.modalidad}\n` +
        `Valor: ${cita.precio ?? ""}\n` +
        `Codigo: ${cita.codigoReserva ?? ""}\n\n` +
        `Motivo de consulta: ${cita.paciente.notas || "—"}\n\n` +
        `Reservado desde el sitio web.`,
      start: { dateTime: inicio, timeZone: ZONA },
      end: { dateTime: fin, timeZone: ZONA },
      attendees: [
        { email: cita.paciente.email, displayName: cita.paciente.nombre },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // recordatorio 24 h antes
          { method: "popup", minutes: 60 },
        ],
      },
      ...(esOnline && {
        conferenceData: {
          createRequest: {
            requestId: `sf-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      }),
    },
  });

  return {
    eventoId: data.id!,
    meetUrl: data.hangoutLink ?? undefined,
    htmlLink: data.htmlLink ?? undefined,
  };
}

/**
 * Acepta una cita pendiente.
 *
 * Le quita la marca de "por confirmar", la pinta de verde y recién ahí
 * Google manda la invitación a la paciente.
 */
export async function confirmarEvento(eventoId: string): Promise<{
  ok: boolean;
  yaResuelta?: boolean;
  meetUrl?: string;
  datos?: DatosEvento;
}> {
  if (!usaCalendarioReal()) return { ok: true };

  const calendar = clienteCalendario();
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  const { data: actual } = await calendar.events.get({ calendarId, eventId: eventoId });
  const titulo = actual.summary ?? "";
  // Ya se decidió antes: el enlace del correo puede abrirse dos veces
  if (!titulo.startsWith("⏳ POR CONFIRMAR")) {
    return { ok: true, yaResuelta: true };
  }

  // Aceptada, pero aún no definitiva: falta la transferencia. La invitación
  // de Google se manda al confirmarse el pago, no ahora.
  const { data } = await calendar.events.patch({
    calendarId,
    eventId: eventoId,
    sendUpdates: "none",
    requestBody: {
      summary: titulo.replace("⏳ POR CONFIRMAR — ", "💸 POR PAGAR — "),
      colorId: "5", // amarillo: esperando el comprobante
    },
  });

  return {
    ok: true,
    meetUrl: data.hangoutLink ?? undefined,
    datos: datosDelEvento(data.description ?? ""),
  };
}

/** Rechaza una cita pendiente: borra el evento y libera la hora. */
export async function rechazarEvento(eventoId: string): Promise<{
  ok: boolean;
  yaResuelta?: boolean;
  datos?: DatosEvento;
}> {
  if (!usaCalendarioReal()) return { ok: true };

  const calendar = clienteCalendario();
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  const { data: actual } = await calendar.events.get({ calendarId, eventId: eventoId });
  const t = actual.summary ?? "";
  // Se puede rechazar tanto una solicitud nueva como una que no pagó a tiempo
  if (!t.startsWith("⏳ POR CONFIRMAR") && !t.startsWith("💸 POR PAGAR")) {
    return { ok: true, yaResuelta: true };
  }

  const datos = datosDelEvento(actual.description ?? "");
  await calendar.events.delete({ calendarId, eventId: eventoId, sendUpdates: "none" });
  return { ok: true, datos };
}

/**
 * Marca la cita como pagada: es el paso final.
 *
 * Recién aquí Google envía la invitación, porque recién aquí la hora es firme.
 */
export async function marcarPagada(eventoId: string): Promise<{
  ok: boolean;
  yaResuelta?: boolean;
  datos?: DatosEvento;
}> {
  if (!usaCalendarioReal()) return { ok: true };

  const calendar = clienteCalendario();
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  const { data: actual } = await calendar.events.get({ calendarId, eventId: eventoId });
  const titulo = actual.summary ?? "";
  if (!titulo.startsWith("💸 POR PAGAR")) {
    return { ok: true, yaResuelta: true };
  }

  const { data } = await calendar.events.patch({
    calendarId,
    eventId: eventoId,
    sendUpdates: "all", // ahora sí: la hora está firme
    requestBody: {
      summary: titulo.replace("💸 POR PAGAR — ", ""),
      colorId: "10", // verde
    },
  });

  return { ok: true, datos: datosDelEvento(data.description ?? "") };
}

type DatosEvento = {
  servicio: string;
  paciente: string;
  email: string;
  precio: number;
  codigo: string;
};

/** Recupera los datos de la paciente desde la descripción del evento. */
function datosDelEvento(desc: string): DatosEvento {
  const sacar = (campo: string) =>
    desc.match(new RegExp(`${campo}: (.+)`))?.[1]?.trim() ?? "";
  return {
    servicio: sacar("Servicio"),
    paciente: sacar("Paciente"),
    email: sacar("Email"),
    precio: Number(sacar("Valor")) || 0,
    codigo: sacar("Codigo"),
  };
}

export type { Cita };
