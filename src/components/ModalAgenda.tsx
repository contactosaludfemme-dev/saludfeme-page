"use client";

import { useEffect, useRef } from "react";
import Agendar from "./Agendar";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
  servicioInicial?: string;
};

export default function ModalAgenda({ abierto, onCerrar, servicioInicial }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const previo = useRef<HTMLElement | null>(null);

  /* Bloquea el scroll del fondo y compensa el ancho de la barra
     para que la página no salte al abrir. */
  useEffect(() => {
    if (!abierto) return;
    const anchoBarra = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (anchoBarra > 0) document.body.style.paddingRight = `${anchoBarra}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [abierto]);

  /* Devuelve el foco al elemento que abrió el modal. */
  useEffect(() => {
    if (abierto) {
      previo.current = document.activeElement as HTMLElement;
      // Enfoca el panel para que el lector de pantalla anuncie el diálogo
      requestAnimationFrame(() => panel.current?.focus());
    } else {
      previo.current?.focus?.();
    }
  }, [abierto]);

  /* Escape para cerrar y Tab que no se escapa del diálogo. */
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCerrar();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;

      const focusables = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain bg-carbon/45 p-3 backdrop-blur-sm sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-agenda"
        tabIndex={-1}
        className="animate-aparecer relative my-auto w-full max-w-3xl rounded-3xl bg-white shadow-fuerte outline-none"
      >
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute right-2.5 top-2.5 z-10 grid size-11 place-items-center rounded-full bg-white/90 text-carbon shadow-suave backdrop-blur transition-colors hover:bg-rosa-100 hover:text-magenta-600"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <Agendar enModal servicioInicial={servicioInicial} onCerrar={onCerrar} />
      </div>
    </div>
  );
}
