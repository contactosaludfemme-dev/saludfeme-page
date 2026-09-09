/**
 * Capa de disponibilidad.
 *
 * CÓMO FUNCIONA EN PRODUCCIÓN
 * Francisca no necesita un panel de administración: su propio Google
 * Calendar cumple ese rol. Para abrir horas, crea en su calendario un
 * evento cuyo título empiece con "DISPONIBLE" (ver PREFIJO_DISPONIBLE).
 *
 *   Ejemplo — abre el martes de 15:00 a 19:00:
 *     Título: DISPONIBLE
 *     Martes 15:00 – 19:00
 *
 * El sitio parte ese bloque en horas según la duración del servicio y las
 * ofrece. Todo lo demás de su calendario (reuniones, citas ya tomadas, lo
 * personal) queda automáticamente fuera.
 *
 * Ventajas de este modelo:
 *  - Usa la app que ya tiene en el celular, sin aprender nada nuevo
 *  - Puede repetir un bloque semanalmente con la recurrencia de Google
 *  - Si le sale un imprevisto, borra el bloque y desaparece del sitio
 *  - No hay contraseñas ni panel que mantener
 *
 * DEMO: mientras MODO_DEMO esté activo en google-calendar.ts, la
 * disponibilidad se genera con las reglas de respaldo de este archivo.
 */

/**
 * Prefijo que Francisca escribe en el título del evento para abrir horas.
 * No distingue mayúsculas ni tildes.
 */
export const PREFIJO_DISPONIBLE = "DISPONIBLE";

export const ZONA = "America/Santiago";

/** Horario de atención por día de la semana (0 = domingo). */
const HORARIO: Record<number, { desde: number; hasta: number } | null> = {
  0: null,                          // domingo cerrado
  1: { desde: 9, hasta: 19 },       // lunes
  2: { desde: 9, hasta: 19 },
  3: { desde: 9, hasta: 19 },
  4: { desde: 9, hasta: 19 },
  5: { desde: 9, hasta: 15 },       // viernes
  6: { desde: 10, hasta: 14 },      // sábado
};

/** Anticipación mínima para reservar (horas). */
const ANTICIPACION_MIN_HORAS = 12;
/** Ventana máxima hacia adelante (días). */
export const VENTANA_DIAS = 60;

/**
 * Feriados chilenos irrenunciables y legales.
 * Se incluyen dos años porque la ventana de reserva cruza el cambio de año.
 * En producción los feriados salen del propio Google Calendar de la matrona
 * (o del calendario de feriados de Chile suscrito en su cuenta).
 */
const FERIADOS = new Set([
  // 2026
  "2026-01-01", "2026-04-03", "2026-04-04", "2026-05-01", "2026-05-21",
  "2026-06-21", "2026-06-29", "2026-07-16", "2026-08-15", "2026-09-18",
  "2026-09-19", "2026-10-12", "2026-10-31", "2026-11-01", "2026-12-08",
  "2026-12-25",
  // 2027
  "2027-01-01", "2027-03-26", "2027-03-27", "2027-05-01", "2027-05-21",
  "2027-06-21", "2027-06-28", "2027-07-16", "2027-08-15", "2027-09-17",
  "2027-09-18", "2027-09-19", "2027-10-11", "2027-10-31", "2027-11-01",
  "2027-12-08", "2027-12-25",
]);

/** Devuelve "YYYY-MM-DD" de una fecha, en hora local. */
export function claveFecha(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/** Parsea "YYYY-MM-DD" a Date local (evita el desfase UTC de new Date(str)). */
export function desdeClave(clave: string): Date {
  const [y, m, d] = clave.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Hash determinístico de un string → entero.
 * Se usa para simular ocupación estable entre renders (evita Math.random,
 * que provocaría hydration mismatch entre servidor y cliente).
 */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export type Bloque = { hora: string; libre: boolean };

/**
 * Genera los bloques horarios de un día para un servicio de N minutos.
 * DEMO: marca algunos bloques como ocupados de forma determinística.
 */
export function bloquesDelDia(clave: string, duracionMin: number): Bloque[] {
  const fecha = desdeClave(clave);
  const regla = HORARIO[fecha.getDay()];
  if (!regla || FERIADOS.has(clave)) return [];

  const paso = duracionMin >= 60 ? 60 : 30;
  const bloques: Bloque[] = [];
  const ahora = new Date();
  const limite = new Date(ahora.getTime() + ANTICIPACION_MIN_HORAS * 3600_000);

  for (let min = regla.desde * 60; min + duracionMin <= regla.hasta * 60; min += paso) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    const hora = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    const inicio = new Date(fecha);
    inicio.setHours(h, m, 0, 0);

    // Pasado o dentro de la anticipación mínima
    if (inicio < limite) {
      bloques.push({ hora, libre: false });
      continue;
    }

    // Colación 13:00–14:00 de lunes a viernes
    if (fecha.getDay() >= 1 && fecha.getDay() <= 5 && h === 13) {
      bloques.push({ hora, libre: false });
      continue;
    }

    // DEMO: ~35% ocupado, determinístico por fecha+hora
    const ocupado = hash(`${clave}${hora}`) % 100 < 35;
    bloques.push({ hora, libre: !ocupado });
  }

  return bloques;
}

/** ¿Tiene el día al menos un bloque libre? */
export function tieneCupo(clave: string, duracionMin: number): boolean {
  return bloquesDelDia(clave, duracionMin).some((b) => b.libre);
}

/** Nombre del mes en español: "Agosto de 2026". */
export function nombreMes(d: Date): string {
  const t = d.toLocaleDateString("es-CL", { month: "long", year: "numeric" });
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Fecha larga legible: "Viernes 21 de agosto de 2026". */
export function fechaLarga(clave: string): string {
  const t = desdeClave(clave).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  // Solo la primera letra en mayúscula (CSS capitalize afectaría cada palabra)
  return t.charAt(0).toUpperCase() + t.slice(1);
}
