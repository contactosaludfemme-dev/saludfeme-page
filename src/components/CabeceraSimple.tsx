import Link from "next/link";
import { CONTACTO } from "@/lib/datos";
import LogoSaludFemme from "./LogoSaludFemme";

/** Cabecera para páginas internas (blog, legales). */
export default function CabeceraSimple() {
  return (
    <header className="sticky top-0 z-40 border-b border-gris-claro bg-rosa-50/92 backdrop-blur-md">
      <div className="mx-auto flex min-h-[4.5rem] max-w-4xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-3">
          <LogoSaludFemme className="h-10 w-auto" />
          <span className="hidden flex-col border-l border-gris-claro pl-3 leading-tight sm:flex">
            <span className="font-titulo text-[0.95rem] font-bold text-carbon">
              {CONTACTO.nombre}
            </span>
            <span className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-coral-500">
              {CONTACTO.profesion}
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/blog"
            className="hidden min-h-11 items-center text-[0.9rem] font-medium text-carbon transition-colors hover:text-magenta-600 sm:inline-flex"
          >
            Blog
          </Link>
          <Link
            href="/#agendar"
            className="inline-flex min-h-11 items-center rounded-full bg-magenta-500 px-5 font-titulo text-[0.88rem] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-magenta-600"
          >
            Agendar hora
          </Link>
        </nav>
      </div>
    </header>
  );
}
