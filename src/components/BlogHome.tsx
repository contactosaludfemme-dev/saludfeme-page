import Link from "next/link";
import { articulosOrdenados, fechaLegible } from "@/lib/blog";
import ArtePost from "./ArtePost";

/** Bloque en la home con los últimos artículos. */
export default function BlogHome() {
  const ultimos = articulosOrdenados().slice(0, 3);

  return (
    <section id="blog" className="bg-rosa-50 py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block font-titulo text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-coral-500">
            Información que sirve
          </span>
          <h2 className="text-[clamp(1.7rem,3.2vw,2.2rem)]">Del blog</h2>
          <p className="mt-2 text-[0.93rem] text-gris">
            Lo que más me preguntan en consulta, explicado con calma.
          </p>
        </div>

        {/* Móvil: carrusel horizontal. Escritorio: rejilla de 3. */}
        <div className="sin-barra -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {ultimos.map((a) => (
            <article key={a.slug} className="w-[15.5rem] shrink-0 snap-start md:w-auto">
              <Link
                href={`/blog/${a.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gris-claro bg-white no-underline shadow-suave transition-all hover:-translate-y-1 hover:border-rosa-200 hover:shadow-media"
              >
                <ArtePost
                  imagen={a.imagen}
                  icono={a.icono}
                  titulo={a.titulo}
                  className="!rounded-none"
                />
                <div className="flex flex-1 flex-col p-5">
                <span className="mb-2 inline-block w-fit text-[0.78rem] font-bold uppercase tracking-wide text-coral-500">
                  {a.tema}
                </span>
                <h3 className="mb-2 font-titulo text-[1rem] font-bold leading-snug text-carbon">
                  {a.titulo}
                </h3>
                <p className="mb-4 flex-1 text-[0.86rem] leading-relaxed text-gris">
                  {a.bajada}
                </p>
                <p className="border-t border-gris-claro pt-3 text-[0.78rem] text-gris">
                  <time dateTime={a.fecha}>{fechaLegible(a.fecha)}</time>
                  {" · "}
                  {a.minutosLectura} min
                </p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-7 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border-2 border-magenta-500 px-6 py-2.5 font-titulo text-[0.9rem] font-semibold text-magenta-600 no-underline transition-colors hover:bg-magenta-500 hover:text-white"
          >
            Ver todos los artículos
            <span aria-hidden>→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
