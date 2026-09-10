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

/** ¿Ya se autorizó la cuenta? */
export function estaAutorizado(): boolean {
  return estaConfigurado() && Boolean(process.env.GOOGLE_REFRESH_TOKEN);
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
