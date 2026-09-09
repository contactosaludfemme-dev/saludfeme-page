"use client";

import { useState } from "react";
import { useAgenda } from "./AgendaProvider";
import {
  SERVICIOS, CATEGORIAS, NOTAS_SERVICIOS, MODALIDADES_ATENCION,
  AREAS, TESTIMONIOS, CONTACTO, precioCLP, type Servicio,
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
  const [categoria, setCategoria] = useState<string>(CATEGORIAS[0]);
  const visibles = SERVICIOS.filter((s) => s.categoria === categoria);

  return (
    <section id="servicios" className="bg-rosa-50 py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Encabezado
          eyebrow="En qué puedo ayudarte"
          titulo="Servicios"
          texto="Atenciones personalizadas en un espacio confidencial, con orientación, evaluación de síntomas e indicación de tratamientos."
        />

        {/* Filtro por categoría */}
        <div
          role="group"
          aria-label="Filtrar por categoría"
          className="sin-barra -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
        >
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoria(c)}
              aria-pressed={categoria === c}
              className={`min-h-11 shrink-0 whitespace-nowrap rounded-full border-2 px-4 text-[0.86rem] font-semibold transition-colors ${
                categoria === c
                  ? "border-magenta-500 bg-magenta-500 text-white"
                  : "border-gris-claro bg-white text-gris hover:border-magenta-500 hover:text-magenta-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          {visibles.map((s) => (
            <TarjetaServicio key={s.id} servicio={s} />
          ))}
        </div>

        {/* Reglas que aplican a todas las atenciones */}
        <div className="mt-8 rounded-2xl border border-gris-claro bg-white p-5 md:p-6">
          <p className="mb-3 font-titulo text-[0.95rem] font-bold">
            Antes de agendar, ten presente
          </p>
          <ul className="space-y-2.5">
            {NOTAS_SERVICIOS.map((n) => (
              <li key={n} className="relative pl-6 text-[0.88rem] leading-relaxed text-gris">
                <span aria-hidden className="absolute left-0 top-[0.15rem] text-magenta-500">
                  •
                </span>
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TarjetaServicio({ servicio: s }: { servicio: Servicio }) {
  const { abrir } = useAgenda();

  return (
    <article className="flex flex-col rounded-2xl border border-gris-claro bg-white p-4 shadow-suave transition-all hover:border-rosa-200 hover:shadow-media md:p-5">
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-rosa-100 text-lg"
        >
          {s.icono}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[0.98rem] leading-snug">{s.nombre}</h3>
          <p className="mt-0.5 font-titulo text-[1.02rem] font-bold text-magenta-600">
            {s.precioNota ?? precioCLP(s.precio)}
            {s.precioOnline && (
              <span className="ml-1.5 text-[0.8rem] font-normal text-gris">
                presencial · {precioCLP(s.precioOnline)} online
              </span>
            )}
          </p>
        </div>
      </div>

      <p className="mt-3 flex-1 text-[0.88rem] leading-relaxed text-gris">
        {s.descripcion}
      </p>

      {s.aviso && (
        <p className="mt-3 rounded-lg bg-rosa-50 px-3 py-2 text-[0.8rem] leading-snug text-gris">
          {s.aviso}
        </p>
      )}

      <div className="mt-3 flex items-center gap-2 text-[0.78rem] text-gris">
        {s.duracion && <span>{s.duracion} min</span>}
        {s.duracion && <span aria-hidden>·</span>}
        <span>
          {s.modalidades.includes("online") ? "Presencial u online" : "Solo presencial"}
        </span>
      </div>

      <button
        type="button"
        onClick={() => abrir(s.id)}
        className="mt-3 rounded-full border-2 border-magenta-500 py-2.5 text-center font-titulo text-[0.88rem] font-semibold text-magenta-600 transition-colors hover:bg-magenta-500 hover:text-white"
      >
        Agendar
      </button>
    </article>
  );
}

/* ---------- Modalidades y formas de pago ---------- */
export function Modalidades() {
  return (
    <section id="modalidades" className="bg-rosa-100 py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Encabezado
          eyebrow="Cómo nos vemos"
          titulo="Modalidades de atención"
          texto="Elige la que mejor se acomode a tu momento. Todas con la misma dedicación."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {MODALIDADES_ATENCION.map((m) => (
            <article
              key={m.id}
              className="rounded-2xl border border-gris-claro bg-white p-5 text-center shadow-suave transition-all hover:-translate-y-1 hover:shadow-media md:rounded-3xl md:p-6"
            >
              <span aria-hidden className="mb-2 block text-3xl md:text-4xl">
                {m.icono}
              </span>
              <h3 className="mb-1 text-[1.05rem]">{m.nombre}</h3>
              <p className="font-titulo text-xl font-bold text-magenta-600">
                {precioCLP(m.precio)}
              </p>
              <p className="mb-2 text-[0.8rem] text-coral-500">{m.duracion} minutos</p>
              <p className="text-[0.87rem] leading-relaxed text-gris">
                {m.descripcion}
              </p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gris-claro bg-white p-5 text-center shadow-suave md:rounded-3xl md:p-7">
          <p className="mb-2 font-titulo text-[1.05rem] font-bold text-carbon">
            Atención particular
          </p>
          <p className="mx-auto max-w-xl text-[0.92rem] leading-relaxed text-gris">
            El pago se realiza por <strong>transferencia electrónica</strong>.
            Tu hora queda confirmada una vez recibido el comprobante.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-[0.85rem] leading-relaxed text-gris">
            No cuento con convenio Fonasa ni Isapre.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Áreas de atención ---------- */
export function Areas() {
  const { abrir } = useAgenda();

  return (
    <section className="bg-white py-14 lg:py-16">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <span className="mb-2 inline-block font-titulo text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-coral-500">
          En qué puedo ayudarte
        </span>
        <h2 className="mb-7 text-[clamp(1.6rem,3vw,2.1rem)]">
          Áreas de atención
        </h2>

        <ul className="flex flex-wrap justify-center gap-2.5">
          {AREAS.map((a) => (
            <li
              key={a.nombre}
              className="flex items-center gap-2 rounded-full border border-gris-claro bg-rosa-50 px-4 py-2 text-[0.88rem] font-semibold text-carbon"
            >
              <span aria-hidden>{a.icono}</span>
              {a.nombre}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => abrir()}
          className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-magenta-500 px-7 font-titulo font-semibold text-white shadow-media transition-all hover:-translate-y-0.5 hover:bg-magenta-600"
        >
          Agendar mi hora
        </button>
      </div>
    </section>
  );
}

/* ---------- Sobre mí ---------- */
const TRAYECTORIA = [
  {
    t: "Matrona · Licenciada en Obstetricia y Puericultura",
    s: "Universidad Autónoma de Chile · Aprobada con distinción, 2020",
  },
  {
    t: "Especialización internacional en Sexología",
    s: "Centro Integrato di Sessuologia Il Ponte",
  },
  { t: "Diplomado en Sexualidad", s: "" },
  { t: "Diplomado en Recién Nacido de Alto Riesgo", s: "" },
  { t: "Diplomado en Salud Familiar", s: "" },
  { t: "Diplomado en Gestión de Calidad en Salud", s: "" },
  {
    t: "Más de 6 años de experiencia",
    s: "En servicio público y privado",
  },
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
            Soy {CONTACTO.nombre}
          </h2>
          <p className="mt-4 text-gris">
            Matrona y creadora de {CONTACTO.marca}. Mi propósito es acompañar a
            las mujeres en las distintas etapas de su vida, entregando una
            atención cercana, respetuosa y personalizada.
          </p>
          <p className="text-gris">
            Me interesa abordar la salud femenina desde una mirada integral,
            considerando no solo la salud física, sino también la educación, la
            sexualidad y el bienestar de cada mujer. Cuento con especialización
            en Sexología, formación que me permite abordar estos temas con una
            mirada respetuosa y libre de prejuicios.
          </p>
          <p className="text-gris">
            Quiero que encuentres un espacio donde puedas preguntar, conversar y
            tomar decisiones sobre tu salud con información clara y sin juicios.
            Porque cuidar nuestra salud también significa sentirnos escuchadas,
            comprendidas y protagonistas de nuestras propias decisiones. 🩷
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
                {item.s && (
                  <span className="text-[0.88rem] text-gris">{item.s}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Cierre ---------- */
export function Cierre() {
  const { abrir } = useAgenda();
  const wa = `https://wa.me/${CONTACTO.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hola Francisca, quiero agendar una hora 🩷"
  )}`;

  return (
    <section className="bg-gradient-to-br from-magenta-600 to-coral-500 py-16 lg:py-20">
      <div className="mx-auto max-w-2xl px-5 text-center">
        <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] text-white">
          ¿Hablamos? 🩷
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[1rem] leading-relaxed text-white/85">
          Si tienes una duda, necesitas orientación o simplemente quieres
          comenzar a cuidar más de tu salud, estoy aquí para acompañarte.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => abrir()}
            className="min-h-11 rounded-full bg-white px-7 font-titulo font-semibold text-magenta-600 shadow-fuerte transition-transform hover:-translate-y-0.5"
          >
            Agendar mi hora
          </button>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border-2 border-white/40 px-6 font-titulo font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            WhatsApp
          </a>
        </div>

        <p className="mt-8 font-mano text-[1.5rem] leading-tight text-white">
          Tu salud. Tu espacio. Tus decisiones. 🩷
        </p>
      </div>
    </section>
  );
}

/* ---------- Testimonios ---------- */
export function Testimonios() {
  if (TESTIMONIOS.length === 0) return null;

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
