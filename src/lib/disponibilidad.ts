/**
 * Traduce los bloques que Francisca marca en su Google Calendar en horas
 * concretas que la paciente puede reservar.
 *
 * Ella declara disponibilidad creando eventos titulados "DISPONIBLE".
 * Todo lo demás en su calendario cuenta como ocupado.
 */

import { PREFIJO_DISPONIBLE, ZONA, type Bloque } from "./calendario";

/**
 * Hora y minutos de un instante, en horario de Chile.
 *
 * El servidor de Vercel corre en UTC, así que `getHours()` devolvería la
 * hora equivocada: un bloque de las 13:00 en Talca se leería como 16:00.
 * Hay que resolverlo con la zona horaria explícita.
 */
function horaEnChile(d: Date): { h: number; m: number } {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONA,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const h = Number(partes.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(partes.find((p) => p.type === "minute")?.value ?? 0);
  return { h: h === 24 ? 0 : h, m };
}

export type Intervalo = { inicio: Date; fin: Date };

/** ¿El título del evento abre disponibilidad? */
export function esBloqueDisponible(titulo: string | null | undefined): boolean {
  if (!titulo) return false;
  const limpio = titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita tildes
    .trim()
    .toUpperCase();
  return limpio.startsWith(PREFIJO_DISPONIBLE);
}

/** ¿Se pisan dos intervalos? */
function seSolapan(a: Intervalo, b: Intervalo): boolean {
  return a.inicio < b.fin && b.inicio < a.fin;
}

/**
 * Parte los bloques abiertos en horas de `duracionMin`, descartando las que
 * choquen con algo ya agendado o que no cumplan la anticipación mínima.
 *
 * @param abiertos   Bloques "DISPONIBLE" del día
 * @param ocupados   Eventos ya agendados (citas, reuniones, lo que sea)
 * @param duracionMin Duración de la atención elegida
 * @param paso       Cada cuántos minutos se ofrece una hora
 * @param desde      Momento mínimo reservable (anticipación)
 */
export function calcularBloques(
  abiertos: Intervalo[],
  ocupados: Intervalo[],
  duracionMin: number,
  paso = 30,
  desde: Date = new Date()
): Bloque[] {
  const salida: Bloque[] = [];
  const vistos = new Set<string>();

  for (const abierto of abiertos) {
    const cursor = new Date(abierto.inicio);

    while (true) {
      const fin = new Date(cursor.getTime() + duracionMin * 60_000);
      // La atención completa debe caber dentro del bloque abierto
      if (fin > abierto.fin) break;

      const { h, m } = horaEnChile(cursor);
      const hora = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

      if (!vistos.has(hora)) {
        vistos.add(hora);
        const propuesta = { inicio: new Date(cursor), fin };
        const libre =
          cursor >= desde && !ocupados.some((o) => seSolapan(propuesta, o));
        salida.push({ hora, libre });
      }

      cursor.setMinutes(cursor.getMinutes() + paso);
    }
  }

  return salida.sort((a, b) => a.hora.localeCompare(b.hora));
}

/** Convierte la respuesta de Google Calendar en intervalos. */
export function aIntervalos(
  eventos: { start?: { dateTime?: string | null }; end?: { dateTime?: string | null } }[]
): Intervalo[] {
  return eventos
    .filter((e) => e.start?.dateTime && e.end?.dateTime)
    .map((e) => ({
      inicio: new Date(e.start!.dateTime!),
      fin: new Date(e.end!.dateTime!),
    }));
}
