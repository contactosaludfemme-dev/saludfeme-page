"use client";

import { useEffect, useState } from "react";
import { CONTACTO, TESTIMONIOS } from "@/lib/datos";
import { useAgenda } from "./AgendaProvider";
import LogoSaludFemme from "./LogoSaludFemme";

const ENLACES = [
  { href: "#servicios", texto: "Servicios" },
  { href: "#modalidades", texto: "Modalidades" },
  { href: "#sobre-mi", texto: "Sobre mí" },
  { href: "#preguntas", texto: "Preguntas" },
  { href: "/blog", texto: "Blog" },
  { href: "#contacto", texto: "Contacto" },
];

export default function Header() {
  const { abrir } = useAgenda();
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del fondo con el menú móvil abierto
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all ${
        scrolled
          ? "border-gris-claro bg-rosa-50/90 backdrop-blur-md"
          : "border-transparent bg-rosa-50"
      }`}
    >
      <div className="mx-auto flex min-h-[4.75rem] max-w-6xl items-center justify-between gap-6 px-5">
        <a href="#inicio" className="flex shrink-0 items-center gap-3">
          <LogoSaludFemme className="h-10 w-auto shrink-0" />
          <span className="hidden flex-col border-l border-gris-claro pl-3 leading-tight xl:flex">
            <span className="whitespace-nowrap font-titulo text-[0.85rem] font-bold text-carbon">
              {CONTACTO.nombre}
            </span>
            <span className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-coral-500">
              {CONTACTO.profesion}
            </span>
          </span>
        </a>

        {/* Navegación escritorio */}
        <nav aria-label="Principal" className="hidden items-center gap-5 lg:flex xl:gap-6">
          {ENLACES.map((e) => (
            <a
              key={e.href}
              href={e.href}
              className="group relative whitespace-nowrap py-1 text-[0.9rem] font-medium text-carbon transition-colors hover:text-magenta-600"
            >
              {e.texto}
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-magenta-500 transition-transform duration-200 group-hover:scale-x-100" />
            </a>
          ))}
          <button
            type="button"
            onClick={() => abrir()}
            className="whitespace-nowrap rounded-full bg-magenta-500 px-5 py-2.5 font-titulo text-[0.9rem] font-semibold text-white shadow-media transition-all hover:-translate-y-0.5 hover:bg-magenta-600 hover:shadow-fuerte"
          >
            Agendar hora
          </button>
        </nav>

        {/* Botón móvil */}
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          className="rounded-lg p-2 text-carbon transition-colors hover:bg-rosa-100 lg:hidden"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            {abierto ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M3 12h18" />
                <path d="M3 6h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Menú móvil */}
      {abierto && (
        <nav
          id="menu-movil"
          aria-label="Principal móvil"
          className="animate-aparecer border-t border-gris-claro bg-rosa-50 px-5 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {ENLACES.map((e) => (
              <li key={e.href}>
                <a
                  href={e.href}
                  onClick={() => setAbierto(false)}
                  className="block rounded-lg px-3 py-3 font-medium text-carbon transition-colors hover:bg-rosa-100 hover:text-magenta-600"
                >
                  {e.texto}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <button
                type="button"
                onClick={() => {
                  setAbierto(false);
                  abrir();
                }}
                className="block w-full rounded-full bg-magenta-500 px-6 py-3 text-center font-titulo font-semibold text-white"
              >
                Agendar hora
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
