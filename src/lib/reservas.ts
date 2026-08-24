/**
 * Registro de reservas del demo.
 *
 * DEMO: se guarda en memoria del proceso. Basta para que dos personas no
 * tomen el mismo bloque durante una demostración, pero se pierde al reiniciar
 * el servidor.
 *
 * PRODUCCIÓN: este módulo deja de usarse. Google Calendar es la fuente de
 * verdad — `freebusy.query` devuelve los bloques ya ocupados y `events.insert`
 * los reserva de forma atómica.
 */

/** Claves "YYYY-MM-DD HH:mm" ya tomadas. */
const tomadas = new Map<string, { nombre: string; servicioId: string }>();

function clave(fecha: string, hora: string): string {
  return `${fecha} ${hora}`;
}

/** ¿Este bloque ya fue reservado en esta sesión? */
export function estaTomada(fecha: string, hora: string): boolean {
  return tomadas.has(clave(fecha, hora));
}

/**
 * Marca el bloque como tomado.
 * Devuelve false si otra reserva ganó la carrera (mismo instante).
 */
export function tomar(
  fecha: string,
  hora: string,
  datos: { nombre: string; servicioId: string }
): boolean {
  const k = clave(fecha, hora);
  if (tomadas.has(k)) return false;
  tomadas.set(k, datos);
  return true;
}

/** Libera un bloque (si la creación del evento falló después de tomarlo). */
export function liberar(fecha: string, hora: string): void {
  tomadas.delete(clave(fecha, hora));
}

/** Bloques tomados de un día — para descontarlos de la disponibilidad. */
export function tomadasDelDia(fecha: string): Set<string> {
  const set = new Set<string>();
  for (const k of tomadas.keys()) {
    const [f, h] = k.split(" ");
    if (f === fecha) set.add(h);
  }
  return set;
}
