"use client";

import Image from "next/image";
import { MapPin, Monitor } from "lucide-react";
import { CONTACTO, TRAYECTORIA_CIFRAS } from "@/lib/datos";
import { useAgenda } from "./AgendaProvider";


/** Destello decorativo, como los de sus publicaciones. */
function Destello({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 0l2.6 8.2L22 12l-7.4 3.8L12 24l-2.6-8.2L2 12l7.4-3.8z" />
    </svg>
  );
}

/**
 * Posiciones dispersas a propósito: tamaños, opacidades y tiempos distintos
 * para que no se lea como un patrón regular.
 */
/**
 * Destellos decorativos.
 *
 * En móvil el texto ocupa todo el ancho, así que cada destello tiene una
 * posición propia (`movil`) en las zonas libres: la franja superior, los
 * márgenes laterales y el área de la foto. Desde `sm` vuelven a su
 * posición de escritorio.
 */
const DESTELLOS = [
  // Franja superior, sobre el titular
  { movil: "left-[6%]   top-[3%]",     esc: "sm:left-[14%]  sm:top-[6%]",     size: "size-4",   color: "text-white/75", anim: "animate-brillo-lento", delay: "3.8s" },
  { movil: "right-[12%] bottom-[38%]",     esc: "sm:right-[13%] sm:top-[11%]",    size: "size-7",   color: "text-white", anim: "animate-brillo",       delay: "0s" },
  { movil: "left-[2%]   top-[4%]",     esc: "sm:right-[34%] sm:top-[16%]",    size: "size-3.5", color: "text-white/85", anim: "animate-brillo",       delay: "2.1s" },
  // Márgenes laterales, a la altura del texto
  { movil: "left-[0%]   top-[8%]",    esc: "sm:left-[2%]   sm:top-[36%]",    size: "size-5",   color: "text-white/85", anim: "animate-brillo",       delay: "2.9s" },
  { movil: "right-[0%]  top-[9%]",    esc: "sm:right-[8%]  sm:top-[19%]",    size: "size-5",   color: "text-white/75", anim: "animate-brillo",       delay: "1.1s" },
  { movil: "left-[0%]   top-[62%]",    esc: "sm:left-[28%]  sm:top-[48%]",    size: "size-3.5", color: "text-white/85", anim: "animate-brillo",       delay: "2.4s" },
  { movil: "right-[0%]  top-[64%]",    esc: "sm:right-[5%]  sm:top-[44%]",    size: "size-6",   color: "text-white/85", anim: "animate-brillo-lento", delay: "0.6s" },
  { movil: "left-[1%]   top-[68%]",    esc: "sm:left-[46%]  sm:top-[7%]",     size: "size-4",   color: "text-white/85", anim: "animate-brillo-lento", delay: "1.4s" },
  // Zona de la foto, abajo
  { movil: "right-[4%]  bottom-[26%]", esc: "sm:right-[21%] sm:top-[28%]",    size: "size-6",   color: "text-white/85", anim: "animate-brillo-lento", delay: "2.3s" },
  { movil: "left-[4%]   bottom-[18%]", esc: "sm:left-[3%]   sm:bottom-[14%]", size: "size-5",   color: "text-white/85", anim: "animate-brillo-lento", delay: "0.3s" },
  { movil: "right-[6%]  bottom-[10%]", esc: "sm:right-[6%]  sm:bottom-[12%]", size: "size-6",   color: "text-white/75", anim: "animate-brillo",       delay: "0.9s" },
  { movil: "left-[8%]   bottom-[6%]",  esc: "sm:right-[17%] sm:bottom-[22%]", size: "size-4",   color: "text-white/75", anim: "animate-brillo",       delay: "1.8s" },
  { movil: "right-[18%] bottom-[3%]",  esc: "sm:right-[40%] sm:bottom-[30%]", size: "size-3.5", color: "text-white/85", anim: "animate-brillo-lento", delay: "3.1s" },
  { movil: "left-[22%]  bottom-[1%]",  esc: "sm:left-[38%]  sm:bottom-[9%]",  size: "size-5",   color: "text-white/85", anim: "animate-brillo",       delay: "3.4s" },
  // Acentos rojos del logo, en las zonas claras del degradado
  { movil: "right-[26%] top-[2%]",     esc: "sm:right-[30%] sm:top-[4%]",     size: "size-4",   color: "text-rojo-500/70", anim: "animate-brillo",       delay: "1.6s" },
  { movil: "left-[14%]  bottom-[13%]", esc: "sm:left-[20%]  sm:bottom-[4%]",  size: "size-3.5", color: "text-rojo-500/60", anim: "animate-brillo-lento", delay: "2.7s" },
];

export default function Hero() {
  const { abrir } = useAgenda();
  const wa = `https://wa.me/${CONTACTO.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hola Francisca, quiero agendar una hora 🌸"
  )}`;

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[linear-gradient(145deg,var(--hero-rosa-claro)_0%,var(--hero-rosa)_45%,var(--hero-rosa-hondo)_100%)] pb-16 pt-28 lg:pb-20 lg:pt-32"
    >
      {/* Textura de puntos y manchas suaves */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-40 size-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.40),transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-44 -left-32 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.28),transparent_70%)] blur-3xl"
      />

      {/* Destellos decorativos, como los de sus publicaciones */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {DESTELLOS.map((d, i) => (
          <Destello
            key={i}
            className={`absolute ${d.movil} ${d.esc} ${d.size} ${d.color} ${d.anim}`}
            style={{ animationDelay: d.delay }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-[1.25fr_0.75fr] md:gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14">
        {/* Texto */}
        <div>
          {/* Mayúsculas + manuscrita, como en sus artes */}
          <h1>
            <span className="block font-titulo text-[clamp(2.1rem,5.2vw,3.7rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-white texto-hero-grande">
              Tu salud, tu espacio,
            </span>
            <span className="relative mt-1 inline-block font-mano text-[clamp(2.5rem,5.8vw,4.2rem)] font-bold leading-[1] text-white drop-shadow-[0_2px_14px_rgba(90,2,60,.35)]">
              tus decisiones
              <Destello className="absolute -right-4 -top-4 size-4 text-white sm:-right-5 sm:-top-2 sm:size-5" />
            </span>
          </h1>

          <p className="mt-6 max-w-[44ch] text-[1.06rem] leading-relaxed text-white texto-hero">
            Soy {CONTACTO.nombre}, matrona y creadora de {CONTACTO.marca}. Un
            espacio de atención cercano, respetuoso y sin juicios, enfocado en
            la salud integral de la mujer.
          </p>

          <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.9rem] font-semibold text-white texto-hero">
            <li className="flex items-center gap-1.5">
              <MapPin size={16} strokeWidth={2.5} aria-hidden />
              Talca
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin size={16} strokeWidth={2.5} aria-hidden />
              Linares
            </li>
            <li className="flex items-center gap-1.5">
              <Monitor size={16} strokeWidth={2.5} aria-hidden />
              Online a todo Chile
            </li>
          </ul>

          <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={() => abrir()}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-4 font-titulo font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/15"
            >
              Agendar mi hora
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-7 py-4 font-titulo font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/15"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.6-1.5-.9-2.1-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.2-.5-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
              </svg>
              Escríbeme
            </a>
          </div>
        </div>

        {/* Ilustración */}
        <div className="relative mx-auto mb-8 w-full max-w-[20rem] md:mb-0 md:max-w-none lg:max-w-sm">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 translate-y-4 rounded-[3rem] bg-white/10 blur-2xl"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-4 border-white/70 bg-gradient-to-b from-white/70 to-white/25 shadow-fuerte backdrop-blur-sm">
            <Image
              src="/perfil-saludfeme.jpg"
              alt={`${CONTACTO.nombre}, matrona`}
              fill
              priority
              sizes="(min-width: 1024px) 24rem, (min-width: 768px) 20rem, 20rem"
              className="object-cover object-top"
            />
          </div>

          {/* Credencial, apoyada en el borde inferior de la foto */}
          <div className="absolute -bottom-4 -left-2 flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-fuerte sm:-left-3">
            <span aria-hidden className="text-xl">🎓</span>
            <span className="text-[0.8rem] leading-tight">
              <strong className="block font-titulo text-magenta-600">
                Matrona titulada
              </strong>
              <span className="text-gris">{CONTACTO.registro}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Cifras de trayectoria, a lo ancho como en la referencia */}
      <div className="relative mx-auto mt-6 max-w-6xl px-5 text-center sm:mt-10 sm:text-left">
        <dl className="grid grid-cols-3 gap-x-2 sm:gap-x-10">
          {TRAYECTORIA_CIFRAS.map((s) => (
            <div key={s.lbl} className="flex items-center justify-center sm:gap-7">
              <div className="text-center sm:text-left">
                <dt className="sr-only">{s.lbl}</dt>
                <dd>
                  <span className="block font-titulo text-[1.45rem] font-bold leading-none text-white texto-hero-grande sm:text-[1.7rem]">
                    {s.num}
                  </span>
                  <span className="mt-1 block text-[0.7rem] font-medium leading-snug text-white texto-hero sm:text-[0.78rem]">
                    {s.lbl}
                  </span>
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      {/* Curva hacia la sección siguiente */}
      <svg
        aria-hidden
        viewBox="0 0 1440 80"
        className="absolute bottom-0 left-0 w-full"
        preserveAspectRatio="none"
      >
        <path d="M0 80V34c260 38 520 46 720 20S1200 0 1440 26v54z" fill="#FDF2F4" />
      </svg>
    </section>
  );
}
