import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CabeceraSimple from "@/components/CabeceraSimple";
import ArtePost from "@/components/ArtePost";
import Footer from "@/components/Footer";
import {
  ARTICULOS, buscarArticulo, relacionados, fechaLegible, type Bloque,
} from "@/lib/blog";
import { SERVICIOS, CONTACTO, precioCLP } from "@/lib/datos";

type Params = { params: Promise<{ slug: string }> };

/** Prerenderiza todos los artículos como HTML estático (bueno para SEO). */
export function generateStaticParams() {
  return ARTICULOS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const art = buscarArticulo(slug);
  if (!art) return { title: "Artículo no encontrado" };

  return {
    title: art.titulo,
    description: art.bajada,
    alternates: { canonical: `/blog/${art.slug}` },
    openGraph: {
      type: "article",
      title: art.titulo,
      description: art.bajada,
      publishedTime: art.fecha,
      authors: [CONTACTO.nombre],
    },
  };
}

function Contenido({ bloque }: { bloque: Bloque }) {
  switch (bloque.tipo) {
    case "subtitulo":
      return (
        <h2 className="mb-3 mt-8 font-titulo text-[1.25rem] font-bold">
          {bloque.texto}
        </h2>
      );
    case "lista":
      return (
        <ul className="mb-5 space-y-2.5">
          {bloque.items.map((i) => (
            <li key={i} className="relative pl-6 leading-relaxed text-gris">
              <span aria-hidden className="absolute left-0 font-bold text-magenta-500">
                ✓
              </span>
              {i}
            </li>
          ))}
        </ul>
      );
    case "destacado":
      return (
        <p className="mb-5 rounded-2xl border-l-4 border-magenta-500 bg-rosa-50 p-4 leading-relaxed text-carbon">
          {bloque.texto}
        </p>
      );
    case "alerta":
      return (
        <p className="mb-5 flex gap-3 rounded-2xl border border-coral-500/30 bg-coral-500/8 p-4 leading-relaxed text-carbon">
          <span aria-hidden className="text-lg leading-none">⚠️</span>
          <span>{bloque.texto}</span>
        </p>
      );
    default:
      return <p className="mb-4 leading-relaxed text-gris">{bloque.texto}</p>;
  }
}

export default async function Articulo({ params }: Params) {
  const { slug } = await params;
  const art = buscarArticulo(slug);
  if (!art) notFound();

  const servicio = art.servicioRelacionado
    ? SERVICIOS.find((s) => s.id === art.servicioRelacionado)
    : undefined;
  const otros = relacionados(art);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: art.titulo,
    description: art.bajada,
    datePublished: art.fecha,
    author: {
      "@type": "Person",
      name: CONTACTO.nombre,
      jobTitle: "Matrona",
    },
    publisher: { "@type": "Organization", name: `Matrona ${CONTACTO.nombre}` },
  };

  return (
    <>
      <CabeceraSimple />

      <main className="mx-auto max-w-2xl px-5 py-12">
        <Link
          href="/blog"
          className="mb-5 -ml-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-[0.9rem] font-semibold text-magenta-600 no-underline hover:underline"
        >
          <span aria-hidden>←</span> Volver al blog
        </Link>

        <article>
          <header className="mb-8">
            <ArtePost
              imagen={art.imagen}
              icono={art.icono}
              titulo={art.titulo}
              className="mb-6 w-40 sm:w-48"
            />
            <span className="mb-3 inline-block rounded-full bg-rosa-100 px-3 py-1 text-[0.76rem] font-bold uppercase tracking-wide text-coral-500">
              {art.tema}
            </span>
            <h1 className="text-[clamp(1.7rem,4vw,2.3rem)] leading-tight">
              {art.titulo}
            </h1>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-gris">
              {art.bajada}
            </p>
            <p className="mt-4 flex flex-wrap items-center gap-2 border-t border-gris-claro pt-4 text-[0.83rem] text-gris">
              <span className="font-semibold text-carbon">
                {CONTACTO.nombre}, matrona
              </span>
              <span aria-hidden>·</span>
              <time dateTime={art.fecha}>{fechaLegible(art.fecha)}</time>
              <span aria-hidden>·</span>
              <span>{art.minutosLectura} min de lectura</span>
            </p>
          </header>

          <div className="text-[1.02rem]">
            {art.contenido.map((b, i) => (
              <Contenido key={i} bloque={b} />
            ))}
          </div>
        </article>

        {/* Invitación a agendar */}
        <aside className="mt-10 rounded-3xl bg-gradient-to-br from-magenta-600 to-coral-500 p-6 text-center text-white sm:p-8">
          <p className="font-titulo text-[1.2rem] font-bold">
            ¿Tienes dudas sobre tu caso?
          </p>
          <p className="mx-auto mt-2 max-w-md text-[0.94rem] leading-relaxed text-rosa-100">
            {servicio
              ? `Cada persona es distinta. Conversemos en una consulta de ${servicio.nombre.toLowerCase()} y revisamos tu situación con calma.`
              : "Cada persona es distinta. Agenda una consulta y lo revisamos con calma."}
          </p>
          <Link
            href="/#agendar"
            className="mt-5 inline-block rounded-full bg-white px-7 py-3 font-titulo font-semibold text-magenta-600 no-underline transition-transform hover:-translate-y-0.5"
          >
            {servicio
              ? `Agendar · ${precioCLP(servicio.precio)}`
              : "Agendar mi hora"}
          </Link>
        </aside>

        {otros.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 font-titulo text-[1.1rem] font-bold">
              También sobre {art.tema.toLowerCase()}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {otros.map((o) => (
                <Link
                  key={o.slug}
                  href={`/blog/${o.slug}`}
                  className="rounded-2xl border border-gris-claro bg-white p-4 no-underline shadow-suave transition-all hover:-translate-y-1 hover:border-rosa-200 hover:shadow-media"
                >
                  <span aria-hidden className="mb-2 block text-xl">{o.icono}</span>
                  <span className="block font-titulo text-[0.95rem] font-bold leading-snug text-carbon">
                    {o.titulo}
                  </span>
                  <span className="mt-1 block text-[0.8rem] text-gris">
                    {o.minutosLectura} min de lectura
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
