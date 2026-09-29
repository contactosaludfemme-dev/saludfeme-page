/**
 * Enlaces firmados para confirmar o rechazar una cita desde el correo.
 *
 * Francisca decide con un toque desde su teléfono, sin cuenta ni contraseña.
 * Eso solo es seguro si el enlace no se puede adivinar ni fabricar: cada uno
 * lleva una firma HMAC que únicamente el servidor puede generar.
 */

import { createHmac, timingSafeEqual } from "crypto";

/** Acciones que la matrona puede hacer desde el correo. */
export type Accion = "confirmar" | "rechazar" | "pagada";

/** Datos que viajan dentro del enlace. */
export type Cita = {
  /** Identificador del evento en Google Calendar. */
  id: string;
  fecha: string;
  hora: string;
};

function secreto(): string {
  const s = process.env.TOKEN_SECRET;
  if (!s) {
    throw new Error(
      "Falta TOKEN_SECRET: sin esa variable los enlaces de confirmación " +
        "no se pueden firmar."
    );
  }
  return s;
}

function base64url(b: Buffer): string {
  return b.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function firmar(carga: string): string {
  return base64url(createHmac("sha256", secreto()).update(carga).digest());
}

/**
 * Crea el token de una acción sobre una cita.
 *
 * La acción va dentro de la firma: un enlace de "confirmar" no sirve para
 * rechazar aunque se cambie la palabra en la URL.
 */
export function crearToken(cita: Cita, accion: Accion): string {
  const carga = base64url(
    Buffer.from(JSON.stringify({ ...cita, accion }), "utf8")
  );
  return `${carga}.${firmar(carga)}`;
}

/** Devuelve la cita si el token es auténtico, o null si no lo es. */
export function leerToken(token: string, accion: Accion): Cita | null {
  const [carga, firma] = token.split(".");
  if (!carga || !firma) return null;

  // Comparación en tiempo constante: una comparación normal filtra, por lo
  // que tarda, cuántos caracteres del principio son correctos.
  const esperada = Buffer.from(firmar(carga));
  const recibida = Buffer.from(firma);
  if (esperada.length !== recibida.length) return null;
  if (!timingSafeEqual(esperada, recibida)) return null;

  try {
    const d = JSON.parse(Buffer.from(carga, "base64url").toString("utf8"));
    if (d.accion !== accion) return null;
    if (!d.id || !d.fecha || !d.hora) return null;
    return { id: d.id, fecha: d.fecha, hora: d.hora };
  } catch {
    return null;
  }
}
