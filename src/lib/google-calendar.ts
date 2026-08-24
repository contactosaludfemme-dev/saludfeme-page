/**
 * Integración con Google Calendar API — capa de producción.
 *
 * ESTADO: modo DEMO. Las funciones simulan la respuesta de Google.
 * Para activarlo de verdad:
 *
 *   1. npm install googleapis
 *   2. Google Cloud Console → crear proyecto → habilitar Google Calendar API
 *   3. Crear credenciales OAuth 2.0 (tipo "Aplicación web")
 *      → URI de redirección: https://TU-DOMINIO/api/google/callback
 *   4. Completar .env.local (ver .env.example)
 *   5. Visitar /api/google/auth una vez con la cuenta de la matrona para
 *      obtener el refresh_token y guardarlo en GOOGLE_REFRESH_TOKEN
 *   6. Cambiar MODO_DEMO a false
 *
 * El refresh_token es de larga duración: se autoriza una sola vez.
 */

import { bloquesDelDia, ZONA, type Bloque } from "./calendario";
import { tomadasDelDia } from "./reservas";

export const MODO_DEMO = true;

type Cita = {
  servicio: string;
  duracionMin: number;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm
  paciente: { nombre: string; email: string; telefono: string; notas?: string };
  modalidad: string;
};

/**
 * Consulta los bloques libres de un día.
 * PRODUCCIÓN: usa calendar.freebusy.query sobre el calendario de la matrona
 * y resta los intervalos ocupados del horario de atención.
 */
export async function obtenerDisponibilidad(
  fecha: string,
  duracionMin: number
): Promise<Bloque[]> {
  if (MODO_DEMO) {
    // Descuenta las reservas ya hechas durante esta sesión de demo
    const tomadas = tomadasDelDia(fecha);
    return bloquesDelDia(fecha, duracionMin).map((b) =>
      tomadas.has(b.hora) ? { ...b, libre: false } : b
    );
  }

  /* PRODUCCIÓN:
  const calendar = await clienteCalendario();
  const { data } = await calendar.freebusy.query({
    requestBody: {
      timeMin: `${fecha}T00:00:00-04:00`,
      timeMax: `${fecha}T23:59:59-04:00`,
      timeZone: ZONA,
      items: [{ id: process.env.GOOGLE_CALENDAR_ID! }],
    },
  });
  const ocupados = data.calendars?.[process.env.GOOGLE_CALENDAR_ID!]?.busy ?? [];
  return bloquesDelDia(fecha, duracionMin).map((b) => ({
    ...b,
    libre: b.libre && !chocaCon(b.hora, duracionMin, fecha, ocupados),
  }));
  */
  throw new Error("Google Calendar no configurado");
}

/**
 * Crea el evento en el calendario e invita a la paciente.
 * Devuelve el ID del evento y el enlace de Google Meet si es online.
 */
export async function crearEvento(
  cita: Cita
): Promise<{ eventoId: string; meetUrl?: string; htmlLink?: string }> {
  if (MODO_DEMO) {
    const id = `demo_${cita.fecha.replace(/-/g, "")}_${cita.hora.replace(":", "")}`;
    return {
      eventoId: id,
      meetUrl:
        cita.modalidad === "online"
          ? `https://meet.google.com/demo-${id.slice(-6)}`
          : undefined,
      htmlLink: `https://calendar.google.com/calendar/event?eid=${id}`,
    };
  }

  /* PRODUCCIÓN:
  const calendar = await clienteCalendario();
  const inicio = `${cita.fecha}T${cita.hora}:00`;
  const fin = sumarMinutos(inicio, cita.duracionMin);

  const { data } = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    conferenceDataVersion: cita.modalidad === "online" ? 1 : 0,
    sendUpdates: "all", // Google envía la invitación a la paciente
    requestBody: {
      summary: `${cita.servicio} — ${cita.paciente.nombre}`,
      description:
        `Paciente: ${cita.paciente.nombre}\n` +
        `Teléfono: ${cita.paciente.telefono}\n` +
        `Email: ${cita.paciente.email}\n` +
        `Modalidad: ${cita.modalidad}\n\n` +
        `Motivo/notas: ${cita.paciente.notas || "—"}`,
      start: { dateTime: inicio, timeZone: ZONA },
      end:   { dateTime: fin,    timeZone: ZONA },
      attendees: [{ email: cita.paciente.email, displayName: cita.paciente.nombre }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // recordatorio 24h antes
          { method: "popup", minutes: 60 },
        ],
      },
      ...(cita.modalidad === "online" && {
        conferenceData: {
          createRequest: {
            requestId: `${Date.now()}`,
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
  */
  throw new Error("Google Calendar no configurado");
}

/* PRODUCCIÓN — cliente autenticado:
import { google } from "googleapis";

async function clienteCalendario() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.calendar({ version: "v3", auth });
}

function sumarMinutos(iso: string, min: number): string {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + min);
  return d.toISOString().slice(0, 19);
}
*/

export type { Cita };
