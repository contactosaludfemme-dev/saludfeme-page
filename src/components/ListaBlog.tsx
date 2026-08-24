"use client";

import { useState } from "react";
import Link from "next/link";
import { TEMAS, fechaLegible, type Articulo } from "@/lib/blog";
import ArtePost from "./ArtePost";

export default function ListaBlog({ articulos }: { articulos: Articulo[] }) {
  const [tema, setTema] = useState<string>("Todos");

  const visibles =
    tema === "Todos" ? articulos : articulos.filter((a) => a.tema === tema);

  // Solo se ofrecen los temas que tienen artículos
  const temasConArticulos = TEMAS.filter((t) =>
    articulos.some((a) => a.tema === t)
  );

  return (
    <>
      <div
        role="group"
        aria-label="Filtrar por tema"
        className="sin-barra -mx-5 mb-8 flex snap-x gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
      >
        {["Todos", ...temasConArticulos].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTema(t)}
            aria-pressed={tema === t}
            className={`min-h-11 shrink-0 whitespace-nowrap rounded-full border-2 px-4 text-[0.86rem] font-semibold transition-colors ${
              tema === t
                ? "border-magenta-500 bg-magenta-500 text-white"
                : "border-gris-claro bg-white text-gris hover:border-magenta-500 hover:text-magenta-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {visibles.map((a) => (
          <article key={a.slug} className="h-full">
            <Link
              href={`/blog/${a.slug}`}
              className="group flex h-full gap-4 rounded-2xl border border-gris-claro bg-white p-4 no-underline shadow-suave transition-all hover:-translate-y-1 hover:border-rosa-200 hover:shadow-media"
            >
              <ArtePost
                imagen={a.imagen}
                icono={a.icono}
                titulo={a.titulo}
                className="w-24 shrink-0 sm:w-28"
              />

              <div className="flex min-w-0 flex-1 flex-col">
              <span className="mb-2 inline-block w-fit rounded-full bg-rosa-50 px-2.5 py-0.5 text-[0.78rem] font-bold uppercase tracking-wide text-coral-500">
                {a.tema}
              </span>

              <h2 className="mb-2 font-titulo text-[1rem] font-bold leading-snug text-carbon">
                {a.titulo}
              </h2>
              <p className="mb-4 flex-1 text-[0.89rem] leading-relaxed text-gris">
                {a.bajada}
              </p>

              <p className="flex flex-wrap items-center gap-x-2 border-t border-gris-claro pt-3 text-[0.76rem] text-gris">
                <time dateTime={a.fecha}>{fechaLegible(a.fecha)}</time>
                <span aria-hidden>·</span>
                <span>{a.minutosLectura} min</span>
              </p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {visibles.length === 0 && (
        <p className="rounded-2xl bg-rosa-50 p-8 text-center text-gris">
          Todavía no hay artículos sobre este tema.
        </p>
      )}
    </>
  );
}
