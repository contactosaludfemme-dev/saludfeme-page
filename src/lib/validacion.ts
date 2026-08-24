/** Validación y normalización de datos del formulario de reserva. */

/** Longitudes máximas aceptadas (evita cargas desmedidas). */
export const LIMITES = { nombre: 120, email: 160, telefono: 25, notas: 1000 } as const;

/**
 * Normaliza un teléfono chileno a formato internacional "+56912345678".
 * Acepta cómo la gente escribe de verdad: con o sin +56, con espacios,
 * guiones, puntos o paréntesis.
 * Devuelve null si no es un móvil chileno válido.
 */
export function normalizarTelefono(valor: string): string | null {
  const soloDigitos = String(valor ?? "").replace(/[^\d]/g, "");

  // 56 9 XXXXXXXX  → 11 dígitos
  if (/^569\d{8}$/.test(soloDigitos)) return `+${soloDigitos}`;
  // 9 XXXXXXXX     → 9 dígitos (sin código de país)
  if (/^9\d{8}$/.test(soloDigitos)) return `+56${soloDigitos}`;
  // XXXXXXXX       → 8 dígitos (sin el 9 inicial)
  if (/^\d{8}$/.test(soloDigitos)) return `+569${soloDigitos}`;

  return null;
}

/** Formatea a "+56 9 1234 5678" para mostrar. */
export function formatearTelefono(e164: string): string {
  const d = e164.replace(/[^\d]/g, "");
  if (d.length !== 11) return e164;
  return `+${d.slice(0, 2)} ${d.slice(2, 3)} ${d.slice(3, 7)} ${d.slice(7)}`;
}

/** Validación de correo — deliberadamente permisiva, sin falsos negativos. */
export function emailValido(valor: string): boolean {
  const v = String(valor ?? "").trim();
  if (v.length > LIMITES.email) return false;
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v);
}

/** Recorta espacios y limita la longitud. */
export function limpiar(valor: string | undefined, max: number): string {
  return String(valor ?? "").trim().slice(0, max);
}

/** Un nombre debe tener al menos dos caracteres de letra. */
export function nombreValido(valor: string): boolean {
  const v = String(valor ?? "").trim();
  if (v.length < 3 || v.length > LIMITES.nombre) return false;
  return (v.match(/\p{L}/gu) ?? []).length >= 2;
}
