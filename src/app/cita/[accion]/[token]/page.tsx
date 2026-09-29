/**
 * Página donde la matrona acepta o rechaza una hora, desde el enlace del
 * correo. No hay login: la autenticidad la da la firma del token.
 */

import { notFound } from "next/navigation";
import { crearToken, leerToken } from "@/lib/firma";
import { confirmarEvento, marcarPagada } from "@/lib/google-calendar";
import { CONTACTO, SITIO_URL } from "@/lib/datos";
import { fechaLarga } from "@/lib/calendario";
import { correoPorPagar, correoPagoPendiente, enviarUno } from "@/lib/correo";
import FormularioRechazo from "./FormularioRechazo";

type Params = { params: Promise<{ accion: string; token: string }> };

export const metadata = { robots: { index: false, follow: false } };

function Marco({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-rosa-50 px-5 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-media">
        {children}
      </div>
    </main>
  );
}

export default async function DecidirCita({ params }: Params) {
  const { accion, token } = await params;
  if (accion !== "confirmar" && accion !== "rechazar" && accion !== "pagada")
    notFound();

  const cita = leerToken(token, accion);
  if (!cita) {
    return (
      <Marco>
        <span aria-hidden className="mb-4 block text-4xl">🔒</span>
        <h1 className="text-xl">Enlace no válido</h1>
        <p className="mt-2 text-[0.93rem] leading-relaxed text-gris">
          Este enlace no se pudo verificar. Ábrelo desde el correo original o
          revisa la cita directamente en tu Google Calendar.
        </p>
      </Marco>
    );
  }

  // El rechazo pide un motivo opcional antes de actuar
  if (accion === "rechazar") {
    return (
      <Marco>
        <FormularioRechazo token={token} cita={cita} />
      </Marco>
    );
  }

  if (accion === "pagada") {
    let p;
    try {
      p = await marcarPagada(cita.id);
    } catch {
      return (
        <Marco>
          <span aria-hidden className="mb-4 block text-4xl">🔍</span>
          <h1 className="text-xl">No encontramos esta cita</h1>
          <p className="mt-2 text-[0.93rem] leading-relaxed text-gris">
            Es posible que ya la hayas eliminado desde tu calendario.
          </p>
        </Marco>
      );
    }
    return (
      <Marco>
        <span aria-hidden className="mb-4 block text-4xl">
          {p.yaResuelta ? "👍" : "✓"}
        </span>
        <h1 className="text-xl">
          {p.yaResuelta ? "Esta hora ya estaba resuelta" : "Pago registrado"}
        </h1>
        <p className="mt-2 text-[0.93rem] leading-relaxed text-gris">
          {p.yaResuelta
            ? "No hicimos nada: ya la habías marcado antes."
            : `La hora quedó confirmada y ${p.datos?.paciente ?? "la paciente"} recibió la invitación.`}
        </p>
      </Marco>
    );
  }

  // El evento puede haberse borrado a mano desde el calendario
  let r;
  try {
    r = await confirmarEvento(cita.id);
  } catch {
    return (
      <Marco>
        <span aria-hidden className="mb-4 block text-4xl">🔍</span>
        <h1 className="text-xl">No encontramos esta cita</h1>
        <p className="mt-2 text-[0.93rem] leading-relaxed text-gris">
          Es posible que ya la hayas eliminado desde tu calendario. Revísalo
          para confirmarlo.
        </p>
      </Marco>
    );
  }

  // Aceptada: ahora la paciente recibe los datos para transferir, más el
  // enlace con que la matrona marcará el pago cuando llegue el comprobante.
  if (!r.yaResuelta && r.datos?.email) {
    const base = process.env.NEXT_PUBLIC_SITIO_URL ?? SITIO_URL;
    await enviarUno(
      correoPorPagar(
        { nombre: r.datos.paciente, email: r.datos.email },
        {
          servicio: r.datos.servicio,
          fecha: cita.fecha,
          hora: cita.hora,
          precio: r.datos.precio,
          codigoReserva: r.datos.codigo || "—",
        }
      )
    );
    await enviarUno(
      correoPagoPendiente(
        { nombre: r.datos.paciente },
        { fecha: cita.fecha, hora: cita.hora },
        `${base}/cita/pagada/${crearToken(cita, "pagada")}`
      )
    );
  }

  if (r.yaResuelta) {
    return (
      <Marco>
        <span aria-hidden className="mb-4 block text-4xl">👍</span>
        <h1 className="text-xl">Esta hora ya estaba resuelta</h1>
        <p className="mt-2 text-[0.93rem] leading-relaxed text-gris">
          No hicimos nada: ya la habías confirmado o rechazado antes.
        </p>
      </Marco>
    );
  }

  return (
    <Marco>
      <span aria-hidden className="mb-4 block text-4xl">✓</span>
      <h1 className="text-xl">Hora aceptada</h1>
      <p className="mt-2 text-[0.93rem] leading-relaxed text-gris">
        {fechaLarga(cita.fecha)} a las {cita.hora} hrs.
        {r.datos?.paciente ? ` Le enviamos a ${r.datos.paciente}` : " Enviamos"}{" "}
        los datos para transferir.
      </p>
      <p className="mt-4 rounded-xl bg-rosa-50 px-4 py-3 text-[0.85rem] leading-relaxed text-carbon">
        La cita quedó como <strong>💸 POR PAGAR</strong> en tu calendario. Cuando
        recibas el comprobante, vuelve al correo y marca la hora como pagada:
        ahí se confirma definitivamente.
      </p>
      <p className="mt-6 text-[0.8rem] text-gris/80">{CONTACTO.marca}</p>
    </Marco>
  );
}
