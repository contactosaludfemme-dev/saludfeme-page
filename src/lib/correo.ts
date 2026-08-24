/**
 * Envío de correos transaccionales.
 *
 * ESTADO: modo DEMO — los correos se registran en consola y se devuelven
 * al cliente para mostrarlos en pantalla.
 *
 * Para activar en producción:
 *   1. npm install resend
 *   2. Crear cuenta en resend.com y verificar el dominio
 *   3. Completar RESEND_API_KEY y EMAIL_DESDE en .env.local
 *   4. Cambiar MODO_DEMO a false
 */

import { CONTACTO, precioCLP } from "./datos";
import { fechaLarga } from "./calendario";

export const MODO_DEMO = true;

export type DatosCorreo = {
  paciente: { nombre: string; email: string; telefono: string; notas?: string };
  servicio: string;
  precio: number;
  modalidad: string;
  fecha: string;
  hora: string;
  duracionMin: number;
  meetUrl?: string;
  codigoReserva: string;
};

const M = "#E5308F";
const CARBON = "#2E2A2B";

/**
 * Escapa texto que entra al HTML del correo.
 * Sin esto, lo que la paciente escriba en su nombre o notas se interpreta
 * como marcado al abrir el correo.
 */
function esc(v: string | undefined): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function envoltorio(titulo: string, cuerpo: string): string {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titulo}</title></head>
<body style="margin:0;padding:24px;background:#FDF2F4;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:${CARBON};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.06);">
    <tr><td style="background:linear-gradient(135deg,${M},#D94A3D);padding:28px 32px;">
      <p style="margin:0;color:#fff;font-size:20px;font-weight:700;">Matrona ${CONTACTO.nombre}</p>
      <p style="margin:4px 0 0;color:rgba(255,255,255,.85);font-size:13px;">Salud sexual y reproductiva</p>
    </td></tr>
    <tr><td style="padding:32px;">${cuerpo}</td></tr>
    <tr><td style="background:#FDF2F4;padding:20px 32px;text-align:center;font-size:12px;color:#6B6264;">
      <p style="margin:0 0 6px;">${CONTACTO.direccion}, ${CONTACTO.comuna}</p>
      <p style="margin:0;">${CONTACTO.telefonoDisplay} · ${CONTACTO.email}</p>
    </td></tr>
  </table>
</body></html>`;
}

function tablaCita(d: DatosCorreo): string {
  const fila = (k: string, v: string) =>
    `<tr><td style="padding:8px 0;color:#6B6264;font-size:14px;">${k}</td>
         <td style="padding:8px 0;text-align:right;font-weight:600;font-size:14px;">${v}</td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="background:#FDF2F4;border-radius:12px;padding:16px 20px;margin:20px 0;">
    ${fila("Servicio", esc(d.servicio))}
    ${fila("Fecha", esc(fechaLarga(d.fecha)))}
    ${fila("Hora", esc(`${d.hora} hrs (${d.duracionMin} min)`))}
    ${fila("Modalidad", esc(d.modalidad))}
    ${fila("Valor", esc(precioCLP(d.precio)))}
    ${fila("Código", esc(d.codigoReserva))}
  </table>`;
}

export function correoPaciente(d: DatosCorreo) {
  const meet = d.meetUrl
    ? `<p style="margin:0 0 16px;font-size:15px;">Tu consulta es <strong>online</strong>. Conéctate desde este enlace a la hora agendada:</p>
       <p style="margin:0 0 20px;"><a href="${esc(d.meetUrl)}" style="color:${M};font-weight:600;">${esc(d.meetUrl)}</a></p>`
    : `<p style="margin:0 0 20px;font-size:15px;">Te espero en <strong>${CONTACTO.direccion}</strong>, ${CONTACTO.comuna}. Llega unos minutos antes.</p>`;

  return {
    para: d.paciente.email,
    asunto: `Hora confirmada · ${d.servicio} · ${fechaLarga(d.fecha)}`, // asunto: texto plano
    html: envoltorio(
      "Hora confirmada",
      `<h1 style="margin:0 0 8px;font-size:22px;color:${CARBON};">¡Tu hora está confirmada! 🌸</h1>
       <p style="margin:0 0 4px;font-size:15px;">Hola ${esc(d.paciente.nombre)},</p>
       <p style="margin:0 0 16px;font-size:15px;color:#6B6264;">
         Gracias por agendar conmigo. Acabo de agregar la cita a tu calendario —
         revisa tu correo para aceptar la invitación.</p>
       ${tablaCita(d)}
       ${meet}
       <p style="margin:0 0 8px;font-size:14px;color:#6B6264;"><strong>¿Qué llevar?</strong> Tu carnet de identidad, exámenes previos si tienes y tu carnet de control si aplica.</p>
       <p style="margin:16px 0 0;font-size:13px;color:#6B6264;">
         ¿Necesitas cancelar o cambiar tu hora? Puedes hacerlo hasta 24 horas antes
         escribiéndome al ${CONTACTO.telefonoDisplay}.</p>`
    ),
  };
}

export function correoMatrona(d: DatosCorreo) {
  return {
    para: CONTACTO.email,
    asunto: `Nueva hora agendada · ${d.paciente.nombre} · ${d.fecha} ${d.hora}`,
    html: envoltorio(
      "Nueva reserva",
      `<h1 style="margin:0 0 8px;font-size:22px;color:${CARBON};">Nueva hora agendada</h1>
       ${tablaCita(d)}
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="border:1px solid #E8DFE1;border-radius:12px;padding:16px 20px;">
         <tr><td style="font-size:14px;line-height:1.7;">
           <strong>Paciente:</strong> ${esc(d.paciente.nombre)}<br>
           <strong>Email:</strong> <a href="mailto:${esc(d.paciente.email)}" style="color:${M};">${esc(d.paciente.email)}</a><br>
           <strong>Teléfono:</strong> <a href="https://wa.me/${esc(d.paciente.telefono.replace(/\D/g, ""))}" style="color:${M};">${esc(d.paciente.telefono)}</a><br>
           <strong>Notas:</strong> ${esc(d.paciente.notas) || "—"}
         </td></tr>
       </table>
       <p style="margin:20px 0 0;font-size:13px;color:#6B6264;">El evento ya fue creado en tu Google Calendar.</p>`
    ),
  };
}

/** Envía ambos correos. En modo demo solo los registra y los devuelve. */
export async function enviarCorreos(d: DatosCorreo) {
  const paciente = correoPaciente(d);
  const matrona = correoMatrona(d);

  if (MODO_DEMO) {
    console.log("[DEMO] Correo a paciente →", paciente.para, "|", paciente.asunto);
    console.log("[DEMO] Correo a matrona  →", matrona.para, "|", matrona.asunto);
    return { enviados: false, paciente, matrona };
  }

  /* PRODUCCIÓN:
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await Promise.all([
    resend.emails.send({ from: process.env.EMAIL_DESDE!, to: paciente.para, subject: paciente.asunto, html: paciente.html }),
    resend.emails.send({ from: process.env.EMAIL_DESDE!, to: matrona.para,  subject: matrona.asunto,  html: matrona.html  }),
  ]);
  return { enviados: true, paciente, matrona };
  */
  throw new Error("Resend no configurado");
}
