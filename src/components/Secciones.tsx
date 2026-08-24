"use client";

import { useState } from "react";
import { useAgenda } from "./AgendaProvider";
import {
  SERVICIOS, MODALIDADES, MEDIOS_PAGO,
  TESTIMONIOS, CONTACTO, precioCLP,
} from "@/lib/datos";

/* ---------- Encabezado reutilizable ---------- */
function Encabezado({
  eyebrow, titulo, texto, claro = false,
}: { eyebrow: string; titulo: string; texto?: string; claro?: boolean }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <span className={`mb-3 inline-block font-titulo text-[0.8rem] font-semibold uppercase tracking-[0.14em] ${claro ? "text-rosa-200" : "text-coral-500"}`}>
        {eyebrow}
      </span>
      <h2 className={`text-[clamp(1.8rem,3.6vw,2.5rem)] ${claro ? "text-white" : ""}`}>
        {titulo}
      </h2>
      {texto && (
        <p className={`mt-3 ${claro ? "text-rosa-100" : "text-gris"}`}>{texto}</p>
      )}
    </div>
  );
}

/* ---------- Servicios ---------- */
export function Servicios() {
  return (
    <section id="servicios" className="bg-rosa-50 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Encabezado
          eyebrow="Qué hago"
          titulo="Servicios"
          texto="Atención integral en salud sexual y reproductiva, con el tiempo que cada consulta merece."
        />
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {SERVICIOS.map((s) => (
            <TarjetaServicio key={s.id} servicio={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * En móvil el detalle va colapsado (la lista completa hacía la sección
 * interminable); desde `md` se muestra todo, como en escritorio.
 */
function TarjetaServicio({ servicio: s }: { servicio: (typeof SERVICIOS)[number] }) {
  const { abrir } = useAgenda();
  const [abierto, setAbierto] = useState(false);

  return (
    <article className="flex flex-col rounded-3xl border border-gris-claro bg-white p-5 shadow-suave transition-all hover:border-rosa-200 hover:shadow-media md:p-6 md:hover:-translate-y-1">
      {/* Cabecera: en móvil en fila, en escritorio apilada */}
      <div className="flex items-start gap-3 md:block">
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-xl bg-rosa-100 text-xl md:mb-4 md:size-14 md:rounded-2xl md:text-2xl"
        >
          {s.icono}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[1.02rem] md:mb-2 md:text-lg">{s.nombre}</h3>
          {/* Precio y duración visibles de inmediato en móvil */}
          <p className="mt-0.5 flex items-baseline gap-2 md:hidden">
            <span className="font-titulo text-[1.05rem] font-bold text-magenta-600">
              {precioCLP(s.precio)}
            </span>
            <span className="text-[0.8rem] text-gris">· {s.duracion} min</span>
          </p>
        </div>
      </div>

      {/* Descripción: siempre en escritorio, solo al desplegar en móvil */}
      <p
        className={`text-[0.9rem] text-gris md:mb-4 md:block md:text-[0.93rem] ${
          abierto ? "mt-3 block" : "hidden"
        }`}
      >
        {s.descripcion}
      </p>

      {/* Detalle */}
      <ul
        className={`space-y-2 md:mb-5 md:block ${abierto ? "mt-3 block" : "hidden"}`}
      >
        {s.incluye.map((i) => (
          <li key={i} className="relative pl-6 text-[0.86rem] text-gris">
            <span aria-hidden className="absolute left-0 font-bold text-magenta-500">
              ✓
            </span>
            {i}
          </li>
        ))}
      </ul>

      {/* Botón de detalle, solo en móvil */}
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className="mt-2 -ml-1 flex min-h-11 w-fit items-center gap-1.5 px-1 text-[0.85rem] font-semibold text-magenta-600 md:hidden"
      >
        {abierto ? "Ver menos" : "Ver qué incluye"}
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          aria-hidden
          className={`transition-transform ${abierto ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Precio en escritorio */}
      <div className="mt-auto hidden items-baseline justify-between gap-3 border-t border-gris-claro pt-4 md:flex">
        <span className="font-titulo text-xl font-bold text-magenta-600">
          {precioCLP(s.precio)}
        </span>
        <span className="text-[0.82rem] text-gris">{s.duracion} min</span>
      </div>

      <button
        type="button"
        onClick={() => abrir(s.id)}
        className="mt-4 rounded-full border-2 border-magenta-500 py-2.5 text-center font-titulo text-[0.9rem] font-semibold text-magenta-600 transition-colors hover:bg-magenta-500 hover:text-white"
      >
        Agendar
      </button>
    </article>
  );
}

/* ---------- Modalidades y formas de pago ---------- */
export function Modalidades() {
  return (
    <section className="bg-rosa-100 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Encabezado
          eyebrow="Cómo nos vemos"
          titulo="Modalidades de atención"
          texto="Elige la que mejor se acomode a tu momento. Ambas con la misma dedicación."
        />
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {MODALIDADES.map((m) => (
            <article
              key={m.nombre}
              className="rounded-3xl border border-gris-claro bg-white p-6 text-center shadow-suave transition-all hover:-translate-y-1 hover:shadow-media"
            >
              <span aria-hidden className="mb-3 block text-4xl">{m.icono}</span>
              <h3 className="mb-2 text-lg">{m.nombre}</h3>
              <p className="text-[0.9rem] text-gris">{m.descripcion}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-gris-claro bg-white p-6 text-center shadow-suave sm:p-7">
          <p className="mb-2 font-titulo text-[1.05rem] font-bold text-carbon">
            Atención particular
          </p>
          <p className="mx-auto max-w-xl text-[0.93rem] leading-relaxed text-gris">
            Reserva y paga tu hora online al momento de agendar, o paga
            directamente en la consulta el día de tu cita.
          </p>

          <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
            {MEDIOS_PAGO.map((m) => (
              <li
                key={m}
                className="rounded-full border border-gris-claro bg-rosa-50 px-4 py-2 text-[0.85rem] font-semibold text-gris"
              >
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Sobre mí ---------- */
const TRAYECTORIA = [
  { t: "Matrona, Universidad de Chile", s: "Titulada con distinción · 2014" },
  { t: "Diplomado en Lactancia Materna", s: "Pontificia Universidad Católica · 2017" },
  { t: "Diplomado en Salud Sexual y Reproductiva", s: "Universidad de Santiago · 2019" },
  { t: "Formación en parto respetado", s: "Certificación internacional · 2021" },
  { t: "Consulta propia en Talca", s: "Desde 2020 · +1.200 mujeres atendidas" },
];

export function SobreMi() {
  return (
    <section id="sobre-mi" className="bg-rosa-50 py-20 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="mx-auto w-full max-w-sm">
          <div className="grid aspect-square place-items-center rounded-3xl bg-gradient-to-br from-rosa-200 to-coral-500 shadow-media">
            <p className="px-6 text-center font-titulo text-sm text-white/90">
              Fotografía en consulta
              <span className="mt-1 block text-xs font-normal text-white/70">
                (reemplazar en el sitio final)
              </span>
            </p>
          </div>
        </div>

        <div>
          <span className="mb-3 inline-block font-titulo text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-coral-500">
            Quién te acompaña
          </span>
          <h2 className="text-[clamp(1.8rem,3.6vw,2.5rem)]">
            Hola, soy {CONTACTO.nombre}
          </h2>
          <p className="mt-4 text-gris">
            Llevo más de diez años acompañando a mujeres en los momentos más
            importantes de su vida. Elegí la matronería porque creo que la salud
            sexual y reproductiva se vive mejor cuando una se siente escuchada,
            informada y respetada.
          </p>
          <p className="text-gris">
            En mi consulta no hay apuro. Cada control dura lo que tiene que durar,
            porque las preguntas importan tanto como los exámenes. Trabajo desde
            el enfoque del parto respetado y la decisión informada: mi rol es
            darte toda la información para que tú decidas sobre tu cuerpo.
          </p>

          <ul className="mt-7 space-y-0">
            {TRAYECTORIA.map((item, i) => (
              <li key={item.t} className="relative pb-5 pl-9 last:pb-0">
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 size-3 rounded-full bg-magenta-500 shadow-[0_0_0_4px_var(--color-rosa-100)]"
                />
                {i < TRAYECTORIA.length - 1 && (
                  <span aria-hidden className="absolute left-[5px] top-5 h-full w-px bg-gris-claro" />
                )}
                <strong className="block font-titulo text-[0.98rem]">{item.t}</strong>
                <span className="text-[0.88rem] text-gris">{item.s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonios ---------- */
export function Testimonios() {
  return (
    <section
      id="testimonios"
      className="bg-gradient-to-br from-magenta-600 to-coral-500 py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block font-titulo text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-rosa-200">
            Lo que dicen
          </span>
          <h2 className="text-[clamp(1.7rem,3.2vw,2.2rem)] text-white">
            Testimonios
          </h2>
          <p className="mt-2 text-[0.92rem] text-rosa-100">
            Publicados con la autorización expresa de cada paciente.
          </p>
        </div>
      </div>

      {/* Carrusel horizontal: una fila, se desliza con el dedo o la rueda */}
      <div
        className="sin-barra flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 lg:justify-center"
        role="region"
        aria-label="Testimonios de pacientes"
        tabIndex={0}
      >
        {TESTIMONIOS.map((t) => (
          <figure
            key={t.nombre}
            className="flex w-[19rem] shrink-0 snap-center flex-col rounded-2xl bg-white/95 p-5 shadow-media backdrop-blur-sm"
          >
            <div
              aria-label={`${t.estrellas} de 5 estrellas`}
              className="mb-2 text-[0.9rem] text-coral-500"
            >
              {"★".repeat(t.estrellas)}
              <span className="text-gris-claro">{"★".repeat(5 - t.estrellas)}</span>
            </div>
            <blockquote className="mb-4 flex-1 text-[0.92rem] leading-relaxed text-carbon">
              “{t.texto}”
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-gris-claro pt-3">
              <span
                aria-hidden
                className="grid size-9 shrink-0 place-items-center rounded-full bg-rosa-100 font-titulo text-[0.9rem] font-bold text-magenta-600"
              >
                {t.nombre.charAt(0)}
              </span>
              <span className="min-w-0">
                <strong className="block truncate font-titulo text-[0.88rem]">
                  {t.nombre}
                </strong>
                <span className="text-[0.78rem] text-gris">{t.servicio}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
