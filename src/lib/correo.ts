/**
 * Envío de correos transaccionales.
 *
 * Se activa solo si hay credenciales de Resend. Sin ellas, los correos se
 * registran en consola y se muestran en pantalla al confirmar la reserva.
 *
 * Para activarlo:
 *   1. npm install resend
 *   2. Crear cuenta en resend.com y verificar el dominio
 *   3. Cargar RESEND_API_KEY y EMAIL_DESDE en las variables de entorno
 */

import {
  CONTACTO, SEDES, DATOS_TRANSFERENCIA, precioCLP,
} from "./datos";
import { fechaLarga } from "./calendario";

/** Envía de verdad solo si hay credenciales de Resend configuradas. */
export function envioActivo(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_DESDE);
}

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
      <p style="margin:0;color:#fff;font-size:20px;font-weight:700;">${CONTACTO.marca}</p>
      <p style="margin:4px 0 0;color:rgba(255,255,255,.85);font-size:13px;">Matrona ${CONTACTO.nombre}</p>
    </td></tr>
    <tr><td style="padding:32px;">${cuerpo}</td></tr>
    <tr><td style="background:#FDF2F4;padding:20px 32px;text-align:center;font-size:12px;color:#6B6264;">
      <p style="margin:0 0 6px;">${SEDES.map((s) => `${s.centro}, ${s.ciudad}`).join(" · ")}</p>
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
    : (() => {
        const sede = SEDES.find((s) => d.modalidad.includes(s.ciudad)) ?? SEDES[0];
        return `<p style="margin:0 0 20px;font-size:15px;">Te espero en <strong>${esc(sede.centro)}</strong>, ${esc(sede.direccion)}, ${esc(sede.ciudad)}. Llega unos minutos antes.</p>`;
      })();

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

/* ---------- Preconfirmación ---------- */

/** Aviso a la paciente: la solicitud llegó, falta que la matrona la acepte. */
export function correoSolicitudPaciente(d: DatosCorreo) {
  return {
    para: d.paciente.email,
    asunto: `Recibimos tu solicitud de hora — ${CONTACTO.marca}`,
    html: envoltorio(
      "Solicitud recibida",
      `<h1 style="margin:0 0 12px;font-size:22px;">Hola ${esc(d.paciente.nombre)} 🩷</h1>
       <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
         Recibí tu solicitud de hora. La estoy revisando y te confirmo a la
         brevedad por este mismo correo.
       </p>
       <p style="margin:0 0 4px;font-size:15px;line-height:1.6;">
         <strong>Tu hora aún no está confirmada.</strong> Espera mi respuesta
         antes de organizar tu día.
       </p>
       ${tablaCita(d)}
       <p style="margin:0;font-size:14px;color:${CARBON};line-height:1.6;">
         Si necesitas cambiar algo, escríbeme a ${esc(CONTACTO.telefonoDisplay)}.
       </p>`
    ),
  };
}

/** Aviso a la matrona, con los dos botones de decisión. */
export function correoSolicitudMatrona(
  d: DatosCorreo,
  enlaces: { confirmar: string; rechazar: string }
) {
  const boton = (url: string, texto: string, fondo: string) =>
    `<a href="${esc(url)}" style="display:inline-block;padding:14px 28px;border-radius:999px;
        background:${fondo};color:#fff;font-weight:700;font-size:15px;text-decoration:none;">
       ${texto}
     </a>`;

  return {
    para: CONTACTO.email,
    asunto: `Nueva solicitud: ${d.servicio} — ${fechaLarga(d.fecha)} ${d.hora}`,
    html: envoltorio(
      "Nueva solicitud de hora",
      `<h1 style="margin:0 0 12px;font-size:22px;">Nueva solicitud</h1>
       <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
         <strong>${esc(d.paciente.nombre)}</strong> pidió una hora. Está
         reservada de forma provisional hasta que decidas.
       </p>
       ${tablaCita(d)}
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
              style="background:#FDF2F4;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
         <tr><td style="padding:6px 0;font-size:14px;">📞 ${esc(d.paciente.telefono)}</td></tr>
         <tr><td style="padding:6px 0;font-size:14px;">✉️ ${esc(d.paciente.email)}</td></tr>
         ${
           d.paciente.notas
             ? `<tr><td style="padding:6px 0;font-size:14px;line-height:1.5;">📝 ${esc(d.paciente.notas)}</td></tr>`
             : ""
         }
       </table>
       <p style="margin:0 0 12px;font-size:15px;font-weight:600;">¿Aceptas esta hora?</p>
       <p style="margin:0 0 12px;">${boton(enlaces.confirmar, "✓ Confirmar hora", "#1B8146")}</p>
       <p style="margin:0 0 20px;">${boton(enlaces.rechazar, "✕ Rechazar", "#B83A2E")}</p>
       <p style="margin:0;font-size:13px;color:#6B6264;line-height:1.6;">
         La paciente no recibe nada hasta que decidas. Mientras tanto, la hora
         queda bloqueada para que nadie más la tome.
       </p>`
    ),
  };
}

/** Rechazo: la hora vuelve a estar libre. */
export function correoRechazo(
  paciente: { nombre: string; email: string },
  datos: { servicio: string; fecha: string; hora: string },
  motivo?: string
) {
  return {
    para: paciente.email,
    asunto: `Sobre tu solicitud de hora — ${CONTACTO.marca}`,
    html: envoltorio(
      "Solicitud no confirmada",
      `<h1 style="margin:0 0 12px;font-size:22px;">Hola ${esc(paciente.nombre)}</h1>
       <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
         Lamentablemente no puedo atenderte el
         <strong>${esc(fechaLarga(datos.fecha))} a las ${esc(datos.hora)}</strong>.
       </p>
       ${
         motivo
           ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                 style="background:#FDF2F4;border-radius:12px;padding:16px 20px;margin:0 0 20px;">
                <tr><td style="font-size:14px;line-height:1.6;">${esc(motivo)}</td></tr>
              </table>`
           : ""
       }
       <p style="margin:0 0 20px;font-size:15px;line-height:1.6;">
         Puedes elegir otro horario en el sitio, o escribirme y lo coordinamos
         juntas.
       </p>
       <p style="margin:0;font-size:15px;">
         <a href="https://wa.me/${CONTACTO.telefono.replace(/\D/g, "")}"
            style="color:${M};font-weight:600;">Escríbeme por WhatsApp</a>
       </p>`
    ),
  };
}

export async function enviarCorreos(d: DatosCorreo) {
  const paciente = correoPaciente(d);
  const matrona = correoMatrona(d);

  if (!envioActivo()) {
    console.log("[SIN ENVÍO] Correo a paciente →", paciente.para, "|", paciente.asunto);
    console.log("[SIN ENVÍO] Correo a matrona  →", matrona.para, "|", matrona.asunto);
    return { enviados: false, paciente, matrona };
  }

  try {
    return await despachar([paciente, matrona], { paciente, matrona });
  } catch (e) {
    // Un fallo de correo no debe tumbar la reserva: ya quedó agendada
    console.error("[CORREO] No se pudo enviar:", e);
    return { enviados: false, paciente, matrona };
  }
}


/**
 * La matrona aceptó: la paciente recibe los datos para transferir.
 *
 * La hora todavía no es definitiva — se confirma al llegar el comprobante.
 */
export function correoPorPagar(
  paciente: { nombre: string; email: string },
  datos: {
    servicio: string;
    fecha: string;
    hora: string;
    precio: number;
    codigoReserva: string;
  }
) {
  const t = DATOS_TRANSFERENCIA;
  const wa = `https://wa.me/${CONTACTO.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hola Francisca, quiero pagar mi hora ${datos.codigoReserva}. ¿Me envías los datos para la transferencia?`
  )}`;
  const fila = (k: string, v: string) =>
    `<tr><td style="padding:7px 0;color:#6B6264;font-size:14px;">${k}</td>
         <td style="padding:7px 0;text-align:right;font-weight:600;font-size:14px;">${esc(v)}</td></tr>`;

  return {
    para: paciente.email,
    asunto: `Tu hora está reservada — falta el pago (${datos.codigoReserva})`,
    html: envoltorio(
      "Confirma tu hora con el pago",
      `<h1 style="margin:0 0 12px;font-size:22px;">¡Tengo tu hora, ${esc(paciente.nombre)}! 🩷</h1>
       <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
         Reservé el <strong>${esc(fechaLarga(datos.fecha))} a las ${esc(datos.hora)} hrs</strong>
         para ti. Para dejarla confirmada, transfiere el valor de la consulta y
         envíame el comprobante.
       </p>

       <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
              style="background:#FDF2F4;border-radius:12px;padding:16px 20px;margin:0 0 20px;">
         ${fila("Servicio", datos.servicio)}
         ${fila("Monto", precioCLP(datos.precio))}
         ${fila("Código de reserva", datos.codigoReserva)}
       </table>

       <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">
         <strong>Escríbeme por WhatsApp</strong> y te envío los datos para la
         transferencia. Menciona tu código de reserva para que ubique tu hora.
       </p>

       <p style="margin:0 0 20px;">
         <a href="${esc(wa)}" style="display:inline-block;padding:14px 28px;border-radius:999px;
            background:#25D366;color:#fff;font-weight:700;font-size:15px;text-decoration:none;">
           Pedir los datos por WhatsApp
         </a>
       </p>

       <p style="margin:0;font-size:14px;color:#6B6264;line-height:1.6;">
         Tienes <strong>${t.plazoHoras} horas</strong> para transferir y enviarme
         el comprobante. Pasado ese plazo libero la hora para otra paciente. Si
         necesitas más tiempo, escríbeme y lo vemos.
       </p>`
    ),
  };
}

/**
 * Recordatorio a la matrona: la paciente ya tiene los datos de pago.
 * Incluye el enlace con que marcará la hora como pagada al recibir el
 * comprobante.
 */
export function correoPagoPendiente(
  paciente: { nombre: string },
  datos: { fecha: string; hora: string },
  enlacePagada: string
) {
  return {
    para: CONTACTO.email,
    asunto: `Esperando pago: ${esc(paciente.nombre)} — ${fechaLarga(datos.fecha)} ${datos.hora}`,
    html: envoltorio(
      "Esperando el comprobante",
      `<h1 style="margin:0 0 12px;font-size:22px;">Aceptaste esta hora</h1>
       <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
         <strong>${esc(paciente.nombre)}</strong> ya recibió los datos para
         transferir — ${esc(fechaLarga(datos.fecha))} a las ${esc(datos.hora)} hrs.
       </p>
       <p style="margin:0 0 20px;font-size:15px;line-height:1.6;">
         Cuando te llegue el comprobante, marca la hora como pagada. Recién
         entonces la paciente recibe la invitación al calendario.
       </p>
       <p style="margin:0 0 20px;">
         <a href="${esc(enlacePagada)}" style="display:inline-block;padding:14px 28px;border-radius:999px;
            background:#1B8146;color:#fff;font-weight:700;font-size:15px;text-decoration:none;">
           ✓ Recibí el pago
         </a>
       </p>
       <p style="margin:0;font-size:13px;color:#6B6264;line-height:1.6;">
         Si no paga dentro del plazo, puedes rechazar la hora desde el correo
         anterior y el horario vuelve a quedar libre.
       </p>`
    ),
  };
}

/** Envía los dos correos de solicitud: aviso a la paciente y decisión a la matrona. */
export async function enviarSolicitud(
  d: DatosCorreo,
  enlaces: { confirmar: string; rechazar: string }
) {
  const paciente = correoSolicitudPaciente(d);
  const matrona = correoSolicitudMatrona(d, enlaces);
  return despachar([paciente, matrona], { paciente, matrona });
}

/** Envía un solo correo, para el rechazo. */
export async function enviarUno(correo: {
  para: string;
  asunto: string;
  html: string;
}) {
  return despachar([correo], { correo });
}

/** Envío común: sin credenciales registra en consola y no interrumpe nada. */
async function despachar<T>(
  correos: { para: string; asunto: string; html: string }[],
  detalle: T
): Promise<{ enviados: boolean } & T> {
  if (!envioActivo()) {
    for (const c of correos) {
      console.log("[SIN ENVÍO] →", c.para, "|", c.asunto);
    }
    return { enviados: false, ...detalle };
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const envios = await Promise.all(
      correos.map((c) =>
        resend.emails.send({
          from: process.env.EMAIL_DESDE!,
          to: c.para,
          subject: c.asunto,
          html: c.html,
        })
      )
    );
    // Resend no lanza excepción cuando rechaza un envío: devuelve el motivo
    // en `error`. Sin revisarlo, un correo que nunca salió se daba por
    // enviado y nadie se enteraba.
    const fallidos = envios
      .map((r, i) => ({ para: correos[i].para, error: r.error }))
      .filter((r) => r.error);
    if (fallidos.length) {
      for (const f of fallidos) {
        console.error("[CORREO] Resend rechazó el envío a", f.para, "→", f.error);
      }
      return { enviados: false, ...detalle };
    }
    return { enviados: true, ...detalle };
  } catch (e) {
    // Un fallo de correo no debe tumbar la reserva: ya quedó agendada
    console.error("[CORREO] No se pudo enviar:", e);
    return { enviados: false, ...detalle };
  }
}
