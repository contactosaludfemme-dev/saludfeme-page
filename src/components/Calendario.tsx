"use client";

import { useMemo } from "react";
import { claveFecha, nombreMes, VENTANA_DIAS } from "@/lib/calendario";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

type Props = {
  mes: Date;
  seleccion: string | null;
  diasConCupo: Set<string>;
  onMes: (d: Date) => void;
  onDia: (clave: string) => void;
};

export default function Calendario({ mes, seleccion, diasConCupo, onMes, onDia }: Props) {
  const hoyClave = useMemo(() => claveFecha(new Date()), []);

  const { celdas, puedeAtras, puedeAdelante } = useMemo(() => {
    const año = mes.getFullYear();
    const m = mes.getMonth();
    const primero = new Date(año, m, 1);
    const diasEnMes = new Date(año, m + 1, 0).getDate();

    // Lunes como primer día de la semana
    const offset = (primero.getDay() + 6) % 7;

    const lista: ({ clave: string; dia: number } | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= diasEnMes; d++) {
      lista.push({ clave: claveFecha(new Date(año, m, d)), dia: d });
    }

    const hoy = new Date();
    const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const limite = new Date(hoy);
    limite.setDate(limite.getDate() + VENTANA_DIAS);

    return {
      celdas: lista,
      puedeAtras: primero > inicioMesActual,
      puedeAdelante: new Date(año, m + 1, 1) <= limite,
    };
  }, [mes]);

  return (
    <div>
      <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-gris-claro bg-white">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-gris-claro bg-rosa-50 px-4 py-3">
          <p className="font-titulo text-base font-semibold">
            {nombreMes(mes)}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}
              disabled={!puedeAtras}
              aria-label="Mes anterior"
              className="grid size-9 place-items-center rounded-full border border-gris-claro bg-white transition-colors hover:enabled:border-magenta-500 hover:enabled:bg-magenta-500 hover:enabled:text-white disabled:opacity-35"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}
              disabled={!puedeAdelante}
              aria-label="Mes siguiente"
              className="grid size-9 place-items-center rounded-full border border-gris-claro bg-white transition-colors hover:enabled:border-magenta-500 hover:enabled:bg-magenta-500 hover:enabled:text-white disabled:opacity-35"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 border-b border-gris-claro">
          {DIAS.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-[0.7rem] font-bold uppercase tracking-wide text-gris"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Celdas */}
        <div className="grid grid-cols-7 gap-1 p-2">
          {celdas.map((c, i) => {
            if (!c) return <div key={`v${i}`} aria-hidden />;

            const libre = diasConCupo.has(c.clave);
            const sel = seleccion === c.clave;
            const esHoy = c.clave === hoyClave;

            return (
              <button
                key={c.clave}
                type="button"
                disabled={!libre}
                onClick={() => onDia(c.clave)}
                aria-label={`${c.dia} ${nombreMes(mes)}${libre ? ", con cupos" : ", sin cupos"}`}
                aria-pressed={sel}
                className={[
                  "relative grid h-11 place-items-center rounded-xl text-[0.9rem] transition-colors",
                  sel
                    ? "bg-magenta-500 font-bold text-white"
                    : libre
                      ? "font-semibold text-carbon hover:bg-rosa-100"
                      : "cursor-not-allowed text-gris-claro",
                  esHoy && !sel ? "ring-1 ring-inset ring-coral-500" : "",
                ].join(" ")}
              >
                {c.dia}
                {libre && (
                  <span
                    aria-hidden
                    className={`absolute bottom-1 size-1 rounded-full ${sel ? "bg-white" : "bg-magenta-500"}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-[0.78rem] text-gris">
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-magenta-500" /> Con cupos
        </span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-coral-500" /> Hoy
        </span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-gris-claro" /> Sin disponibilidad
        </span>
      </div>
    </div>
  );
}
