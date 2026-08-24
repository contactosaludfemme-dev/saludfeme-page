import type { Metadata } from "next";
import CabeceraSimple from "@/components/CabeceraSimple";
import Footer from "@/components/Footer";
import ListaBlog from "@/components/ListaBlog";
import { articulosOrdenados } from "@/lib/blog";
import { CONTACTO } from "@/lib/datos";

export const metadata: Metadata = {
  title: "Blog — Información de salud sexual y reproductiva",
  description:
    "Artículos sobre embarazo, parto, lactancia, anticoncepción y salud ginecológica, escritos por una matrona. Información clara y sin tecnicismos.",
  openGraph: {
    title: `Blog | Matrona ${CONTACTO.nombre}`,
    description:
      "Información clara sobre embarazo, lactancia, anticoncepción y salud ginecológica.",
  },
};

export default function Blog() {
  const articulos = articulosOrdenados();

  return (
    <>
      <CabeceraSimple />
      <main className="mx-auto max-w-4xl px-5 py-14">
        <div className="mb-10 text-center">
          <span className="mb-2 inline-block font-titulo text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-coral-500">
            Información que sirve
          </span>
          <h1 className="text-[clamp(1.9rem,4vw,2.6rem)]">Blog</h1>
          <p className="mx-auto mt-3 max-w-xl text-gris">
            Lo que más me preguntan en consulta, explicado con calma y sin
            tecnicismos. Si queda alguna duda, escríbeme.
          </p>
        </div>

        <ListaBlog articulos={articulos} />
      </main>
      <Footer />
    </>
  );
}
