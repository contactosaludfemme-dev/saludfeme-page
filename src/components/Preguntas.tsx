"use client";

import { useState } from "react";
import { FAQS } from "@/lib/datos";

export default function Preguntas() {
  const [abierta, setAbierta] = useState<number | null>(null);

  // Se reparten en dos columnas conservando el orden de lectura vertical
  const mitad = Math.ceil(FAQS.length / 2);
  const columnas = [
    FAQS.slice(0, mitad).map((f, i) => ({ ...f, i })),
    FAQS.slice(mitad).map((f, i) => ({ ...f, i: i + mitad })),
  ];

  return (
    <section id="preguntas" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block font-titulo text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-coral-500">
            Resolvamos tus dudas
          </span>
          <h2 className="text-[clamp(1.7rem,3.2vw,2.2rem)]">
            Preguntas frecuentes
          </h2>
          <p className="mt-2 text-[0.92rem] text-gris">
            Y si queda alguna sin responder, escríbeme por WhatsApp sin compromiso.
          </p>
        </div>

        <div className="grid items-start gap-x-5 gap-y-2.5 md:grid-cols-2">
          {columnas.map((col, c) => (
            <div key={c} className="space-y-2.5">
              {col.map((f) => {
                const activa = abierta === f.i;
                return (
                  <div
                    key={f.p}
                    className={`overflow-hidden rounded-xl border transition-colors ${
                      activa
                        ? "border-magenta-500 bg-rosa-50"
                        : "border-gris-claro bg-white hover:border-rosa-200"
                    }`}
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => setAbierta(activa ? null : f.i)}
                        aria-expanded={activa}
                        aria-controls={`faq-${f.i}`}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-titulo text-[0.92rem] font-semibold"
                      >
                        {f.p}
                        <span
                          aria-hidden
                          className={`grid size-6 shrink-0 place-items-center rounded-full transition-all ${
                            activa
                              ? "rotate-45 bg-magenta-500 text-white"
                              : "bg-rosa-100 text-magenta-600"
                          }`}
                        >
                          <svg
                            width="12"
                            height="12"
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
                    {activa && (
                      <div id={`faq-${f.i}`} className="animate-aparecer px-4 pb-4">
                        <p className="text-[0.89rem] leading-relaxed text-gris">
                          {f.r}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
