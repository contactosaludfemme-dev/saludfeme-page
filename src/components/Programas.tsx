"use client";

import { useState } from "react";
import { PROGRAMAS, precioCLP } from "@/lib/datos";
import { useAgenda } from "./AgendaProvider";

export default function Programas() {
  const { abrir } = useAgenda();
  const [abierto, setAbierto] = useState<string | null>(null);

  return (
    <section id="programas" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-5">
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block font-titulo text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-coral-500">
            Acompañamiento continuo
          </span>
          <h2 className="text-[clamp(1.7rem,3.2vw,2.2rem)]">
            Programas de acompañamiento
          </h2>
          <p className="mt-2 text-[0.93rem] text-gris">
            Cuando el proceso es largo, prefiero acompañarte de principio a fin.
          </p>
        </div>

        <div className="space-y-3">
          {PROGRAMAS.map((pr) => {
            const activo = abierto === pr.id;
            return (
              <article
                key={pr.id}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  activo
                    ? "border-magenta-500 bg-rosa-50"
                    : "border-gris-claro bg-white hover:border-rosa-200"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setAbierto(activo ? null : pr.id)}
                    aria-expanded={activo}
                    aria-controls={`prog-${pr.id}`}
                    className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
                  >
                    <span
                      aria-hidden
                      className="grid size-11 shrink-0 place-items-center rounded-xl bg-rosa-100 text-xl"
                    >
                      {pr.icono}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block font-titulo text-[1.02rem] font-bold">
                        {pr.nombre}
                      </span>
                      <span className="block text-[0.85rem] text-gris">
                        {pr.ritmo}
                      </span>
                    </span>

                    <span className="hidden shrink-0 text-right sm:block">
                      <span className="block font-titulo text-[1.05rem] font-bold text-magenta-600">
                        {precioCLP(pr.precio)}
                      </span>
                      <span className="text-[0.76rem] text-gris">
                        el programa
                      </span>
                    </span>

                    <span
                      aria-hidden
                      className={`grid size-7 shrink-0 place-items-center rounded-full transition-all ${
                        activo
                          ? "rotate-45 bg-magenta-500 text-white"
                          : "bg-rosa-100 text-magenta-600"
                      }`}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </h3>

                {/* Resumen visible solo cuando está cerrado */}
                {!activo && (
                  <p className="px-4 pb-4 text-[0.88rem] text-gris sm:px-5 sm:pl-[4.7rem]">
                    {pr.resumen}
                    <span className="mt-1 block font-titulo text-[0.9rem] font-bold text-magenta-600 sm:hidden">
                      {precioCLP(pr.precio)} el programa
                    </span>
                  </p>
                )}

                {activo && (
                  <div
                    id={`prog-${pr.id}`}
                    className="animate-aparecer px-4 pb-5 sm:px-5 sm:pl-[4.7rem]"
                  >
                    <p className="mb-4 text-[0.93rem] leading-relaxed text-gris">
                      {pr.relato}
                    </p>

                    <ul className="mb-5 grid gap-2 sm:grid-cols-2">
                      {pr.incluye.map((i) => (
                        <li
                          key={i}
                          className="relative pl-6 text-[0.88rem] text-gris"
                        >
                          <span
                            aria-hidden
                            className="absolute left-0 font-bold text-magenta-500"
                          >
                            ✓
                          </span>
                          {i}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gris-claro pt-4">
                      <p className="text-[0.87rem] text-gris">
                        <strong className="font-titulo text-[1rem] font-bold text-magenta-600">
                          {precioCLP(pr.precio)}
                        </strong>{" "}
                        el programa completo
                        <span className="block text-[0.8rem] text-gris/85">
                          Por separado suman {precioCLP(pr.precioSuelto)}.
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => abrir()}
                        className="inline-flex items-center gap-2 rounded-full border-2 border-magenta-500 px-5 py-2 font-titulo text-[0.88rem] font-semibold text-magenta-600 transition-colors hover:bg-magenta-500 hover:text-white"
                      >
                        Conversemos si es para ti
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          aria-hidden
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-6 max-w-lg text-center text-[0.86rem] leading-relaxed text-gris">
          Si prefieres partir con una sola consulta y ver cómo nos entendemos,
          también está bien. Puedes sumarte a un programa después.
        </p>
      </div>
    </section>
  );
}
