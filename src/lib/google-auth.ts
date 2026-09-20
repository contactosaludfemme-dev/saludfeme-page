/**
 * Autenticación con Google Calendar.
 *
 * Se autoriza UNA sola vez desde la cuenta de Salud Femme
 * (contacto.saludfemme@gmail.com) visitando /api/google/auth. Google
 * devuelve un refresh token de larga duración que se guarda en las
 * variables de entorno; con él el sitio consulta y crea eventos sin volver
 * a pedir permiso.
 */

import { google } from "googleapis";

/** Permisos mínimos: leer y crear eventos, nada más. */
export const ALCANCES = ["https://www.googleapis.com/auth/calendar.events"];

/** ¿Están todas las variables necesarias? */
export function estaConfigurado(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REDIRECT_URI
  );
}

/**
 * ¿Hay un refresh token guardado?
 *
 * Ojo: esto solo confirma que la variable existe, no que Google la siga
 * aceptando. Un token puede estar presente y haber sido revocado —usa
 * `verificarAcceso` para comprobarlo de verdad.
 */
export function estaAutorizado(): boolean {
  return estaConfigurado() && Boolean(process.env.GOOGLE_REFRESH_TOKEN);
}

/**
 * Comprueba contra Google que el token sirve.
 * Devuelve el motivo del fallo cuando no.
 */
export async function verificarAcceso(): Promise<
  { ok: true } | { ok: false; motivo: string; detalle: string }
> {
  if (!estaAutorizado()) {
    return { ok: false, motivo: "sin_credenciales", detalle: "Faltan variables de entorno" };
  }
  try {
    const auth = clienteOAuth();
    auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    await auth.getAccessToken(); // canjea el refresh token
    return { ok: true };
  } catch (e) {
    const err = e as { message?: string; response?: { data?: { error?: string; error_description?: string } } };
    const cod = err?.response?.data?.error ?? "desconocido";
    const msg = err?.response?.data?.error_description ?? err?.message ?? String(e);
    return {
      ok: false,
      motivo: cod,
      detalle:
        cod === "invalid_grant"
          ? "El refresh token fue revocado o expiró. Hay que volver a autorizar en /api/google/auth."
          : msg,
    };
  }
}

/** Cliente OAuth sin credenciales de usuario (para iniciar el flujo). */
export function clienteOAuth() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

/** Cliente de Calendar ya autenticado con el refresh token guardado. */
export function clienteCalendario() {
  const auth = clienteOAuth();
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.calendar({ version: "v3", auth });
}
