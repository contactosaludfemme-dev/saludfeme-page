import { NextResponse } from "next/server";
import { crearEvento } from "@/lib/google-calendar";
import { enviarCorreos } from "@/lib/correo";
import { SERVICIOS, duracionDe, precioDe } from "@/lib/datos";
import { bloquesDelDia } from "@/lib/calendario";
import { estaTomada, tomar, liberar } from "@/lib/reservas";
import {
  normalizarTelefono, formatearTelefono, emailValido,
  nombreValido, limpiar, LIMITES,
} from "@/lib/validacion";

export const dynamic = "force-dynamic";

type Cuerpo = {
  servicioId: string;
  fecha: string;
  hora: string;
  modalidad: string;
  nombre: string;
  email: string;
  telefono: string;
  notas?: string;
  consentimiento: boolean;
};

/** Código de reserva legible y determinístico por cita. */
function codigoReserva(fecha: string, hora: string, email: string): string {
  const base = `${fecha}${hora}${email}`;
  let h = 5381;
  for (let i = 0; i < base.length; i++) h = ((h << 5) + h + base.charCodeAt(i)) >>> 0;
  return `FC-${h.toString(36).toUpperCase().slice(0, 6)}`;
}

/** POST /api/reservar */
export async function POST(req: Request) {
  let body: Cuerpo;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const errores: Record<string, string> = {};

  const servicio = SERVICIOS.find((s) => s.id === body.servicioId);
  if (!servicio) errores.servicioId = "Servicio no válido";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.fecha ?? "")) errores.fecha = "Fecha inválida";
  if (!/^\d{2}:\d{2}$/.test(body.hora ?? "")) errores.hora = "Hora inválida";

  if (!nombreValido(body.nombre)) errores.nombre = "Ingresa tu nombre completo";
  if (!emailValido(body.email)) errores.email = "Correo electrónico inválido";

  const telefono = normalizarTelefono(body.telefono);
  if (!telefono) errores.telefono = "Ingresa un celular chileno válido";

  if (!body.consentimiento)
    errores.consentimiento = "Debes aceptar el tratamiento de tus datos";

  if (Object.keys(errores).length > 0) {
    return NextResponse.json({ error: "Datos inválidos", errores }, { status: 400 });
  }

  // Revalidación de disponibilidad en el servidor (evita reservas dobles)
  const enHorario = bloquesDelDia(body.fecha, duracionDe(servicio!, body.modalidad)).some(
    (b) => b.hora === body.hora && b.libre
  );
  if (!enHorario || estaTomada(body.fecha, body.hora)) {
    return NextResponse.json(
      { error: "Ese horario ya no está disponible. Elige otro, por favor." },
      { status: 409 }
    );
  }

  const paciente = {
    nombre: limpiar(body.nombre, LIMITES.nombre),
    email: limpiar(body.email, LIMITES.email).toLowerCase(),
    telefono: formatearTelefono(telefono!),
    notas: limpiar(body.notas, LIMITES.notas),
  };

  // Reserva el bloque antes de crear el evento; si otra petición se adelantó
  // en este mismo instante, gana la primera.
  if (!tomar(body.fecha, body.hora, { nombre: paciente.nombre, servicioId: servicio!.id })) {
    return NextResponse.json(
      { error: "Ese horario acaba de ser reservado. Elige otro, por favor." },
      { status: 409 }
    );
  }

  try {
    const evento = await crearEvento({
      servicio: servicio!.nombre,
      duracionMin: duracionDe(servicio!, body.modalidad),
      fecha: body.fecha,
      hora: body.hora,
      paciente,
      modalidad: body.modalidad,
    });

    const codigo = codigoReserva(body.fecha, body.hora, paciente.email);

    const correos = await enviarCorreos({
      paciente,
      servicio: servicio!.nombre,
      precio: precioDe(servicio!, body.modalidad),
      modalidad: body.modalidad,
      fecha: body.fecha,
      hora: body.hora,
      duracionMin: duracionDe(servicio!, body.modalidad),
      meetUrl: evento.meetUrl,
      codigoReserva: codigo,
    });

    return NextResponse.json({
      ok: true,
      codigoReserva: codigo,
      eventoId: evento.eventoId,
      meetUrl: evento.meetUrl,
      // En demo devolvemos la vista previa de los correos
      vistaPrevia: {
        paciente: { para: correos.paciente.para, asunto: correos.paciente.asunto },
        matrona: { para: correos.matrona.para, asunto: correos.matrona.asunto },
        enviados: correos.enviados,
      },
    });
  } catch {
    // La reserva no se concretó: devolvemos el bloque a la disponibilidad
    liberar(body.fecha, body.hora);
    return NextResponse.json(
      { error: "No pudimos completar la reserva. Intenta nuevamente." },
      { status: 500 }
    );
  }
}
