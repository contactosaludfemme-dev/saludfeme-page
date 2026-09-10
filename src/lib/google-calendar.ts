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

import { bloquesDelDia, ZONA, type Bloque } from "./calendario";
import { tomadasDelDia } from "./reservas";
import { estaAutorizado, clienteCalendario } from "./google-auth";
import {
  calcularBloques,
  aIntervalos,
  esBloqueDisponible,
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
  duracionMin: number
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
    timeMin: `${fecha}T00:00:00-04:00`,
    timeMax: `${fecha}T23:59:59-04:00`,
    singleEvents: true, // expande los eventos que se repiten
    orderBy: "startTime",
    timeZone: ZONA,
  });

  const eventos = data.items ?? [];
  const abiertos = aIntervalos(
    eventos.filter((e) => esBloqueDisponible(e.summary))
  );
  const ocupados = aIntervalos(
    eventos.filter((e) => !esBloqueDisponible(e.summary))
  );

  const desde = new Date(Date.now() + ANTICIPACION_HORAS * 3600_000);
  return calcularBloques(abiertos, ocupados, duracionMin, 30, desde);
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
    sendUpdates: "all", // Google envía la invitación a la paciente
    requestBody: {
      summary: `${cita.servicio} — ${cita.paciente.nombre}`,
      description:
        `Paciente: ${cita.paciente.nombre}\n` +
        `Teléfono: ${cita.paciente.telefono}\n` +
        `Email: ${cita.paciente.email}\n` +
        `Modalidad: ${cita.modalidad}\n\n` +
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

export type { Cita };
