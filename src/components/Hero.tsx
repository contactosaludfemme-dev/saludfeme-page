"use client";

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

/** Posiciones dispersas, con tamaños y tiempos distintos. */
const DESTELLOS = [
  { pos: "right-[13%] top-[11%]",    size: "size-6",   color: "text-white/70",      anim: "animate-brillo",       delay: "0s" },
  { pos: "right-[8%]  top-[19%]",    size: "size-3.5", color: "text-white/50",      anim: "animate-brillo",       delay: "1.1s" },
  { pos: "right-[21%] top-[28%]",    size: "size-4",   color: "text-rosa-300/60",   anim: "animate-brillo-lento", delay: "2.3s" },
  { pos: "right-[5%]  top-[44%]",    size: "size-5",   color: "text-white/45",      anim: "animate-brillo-lento", delay: "0.6s" },
  { pos: "right-[17%] bottom-[22%]", size: "size-3",   color: "text-white/55",      anim: "animate-brillo",       delay: "1.8s" },
  { pos: "left-[5%]   bottom-[17%]", size: "size-4",   color: "text-white/50",      anim: "animate-brillo-lento", delay: "0.3s" },
  { pos: "left-[2%]   top-[36%]",    size: "size-3",   color: "text-rosa-300/55",   anim: "animate-brillo",       delay: "2.9s" },
  { pos: "left-[46%]  top-[7%]",     size: "size-5",   color: "text-white/55",      anim: "animate-brillo-lento", delay: "1.4s" },
  { pos: "left-[38%]  bottom-[9%]",  size: "size-3.5", color: "text-white/45",      anim: "animate-brillo",       delay: "3.4s" },
  { pos: "right-[34%] top-[16%]",    size: "size-2.5", color: "text-white/50",      anim: "animate-brillo",       delay: "2.1s" },
  { pos: "left-[14%]  top-[6%]",     size: "size-3",   color: "text-white/45",      anim: "animate-brillo-lento", delay: "3.8s" },
  { pos: "right-[27%] bottom-[6%]",  size: "size-4",   color: "text-rosa-300/50",   anim: "animate-brillo",       delay: "0.9s" },
];

export default function Hero() {
  const { abrir } = useAgenda();
  const wa = `https://wa.me/${CONTACTO.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hola Francisca, quiero agendar una hora 🩷"
  )}`;

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[linear-gradient(115deg,var(--color-fondo-rosa)_0%,var(--color-fondo-rosa)_22%,var(--color-fondo-medio)_62%,var(--color-fondo-claro)_100%)] py-16 lg:py-20"
    >
      {/* Textura de puntos, muy tenue */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Halos de luz */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-40 size-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.75),transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-44 -left-32 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(253,77,185,.22),transparent_70%)] blur-3xl"
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {DESTELLOS.map((d, i) => (
          <Destello
            key={i}
            className={`absolute ${d.pos} ${d.size} ${d.color} ${d.anim}`}
            style={{ animationDelay: d.delay }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14">
        {/* Texto */}
        <div>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-rojo-600/20 bg-white/85 px-4 py-1.5 text-[0.8rem] font-semibold text-rojo-700 shadow-suave backdrop-blur">
            <span className="size-1.5 animate-latido rounded-full bg-exito-600" />
            Agenda abierta esta semana
          </span>

          {/* Mayúsculas en rojo + manuscrita en rosa, como sus artes */}
          <h1>
            <span className="block font-titulo text-[clamp(2.1rem,5.2vw,3.7rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-rojo-700">
              Tu salud, tu espacio,
            </span>
            <span className="relative mt-1 inline-block font-mano text-[clamp(2.5rem,5.8vw,4.2rem)] font-bold leading-[1] text-rosa-700">
              tus decisiones
              <Destello className="absolute -right-5 -top-2 size-5 text-rosa-400" />
            </span>
          </h1>

          <p className="mt-6 max-w-[44ch] text-[1.06rem] leading-relaxed text-carbon">
            Soy {CONTACTO.nombre}, matrona y creadora de {CONTACTO.marca}. Un
            espacio de atención cercano, respetuoso y sin juicios, enfocado en
            la salud integral de la mujer.
          </p>

          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.9rem] font-semibold text-rojo-700">
            <span>📍 Talca</span>
            <span>📍 Linares</span>
            <span>💻 Online a todo Chile</span>
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => abrir()}
              className="inline-flex items-center gap-2 rounded-full bg-rojo-500 px-8 py-4 font-titulo font-semibold text-white shadow-media transition-all hover:-translate-y-0.5 hover:bg-rojo-600 hover:shadow-fuerte"
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
              className="inline-flex items-center gap-2 rounded-full border-2 border-rojo-500/45 bg-white/60 px-7 py-4 font-titulo font-semibold text-rojo-700 backdrop-blur transition-colors hover:border-rojo-500 hover:bg-white"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.6-1.5-.9-2.1-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.2-.5-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
              </svg>
              Escríbeme
            </a>
          </div>

          <dl className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-rojo-600/15 pt-6">
            {TRAYECTORIA_CIFRAS.map((s, i) => (
              <div key={s.lbl} className="flex items-center gap-7">
                <div>
                  <dt className="sr-only">{s.lbl}</dt>
                  <dd>
                    <span className="block font-titulo text-[1.7rem] font-bold leading-none text-rojo-700">
                      {s.num}
                    </span>
                    <span className="mt-1 block text-[0.78rem] font-medium text-carbon">
                      {s.lbl}
                    </span>
                  </dd>
                </div>
                {i < TRAYECTORIA_CIFRAS.length - 1 && (
                  <span aria-hidden className="hidden h-8 w-px bg-rojo-600/15 sm:block" />
                )}
              </div>
            ))}
          </dl>
        </div>

        {/* Ilustración */}
        <div className="relative mx-auto w-full max-w-sm">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 translate-y-4 rounded-[3rem] bg-white/40 blur-2xl"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-4 border-white/70 bg-white/55 shadow-fuerte backdrop-blur-sm">
            <div className="grid size-full place-content-center place-items-center gap-3 p-8 text-center">
              <span aria-hidden className="text-5xl">👩‍⚕️</span>
              <p className="font-titulo text-[0.9rem] font-semibold text-rojo-600">
                Ilustración de Francisca
              </p>
              <p className="text-[0.78rem] leading-snug text-gris">
                Reemplazar por el personaje ilustrado de sus publicaciones
                (PNG con fondo transparente)
              </p>
            </div>
          </div>

          <div className="absolute -left-3 bottom-8 flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-fuerte">
            <span aria-hidden className="text-xl">🎓</span>
            <span className="text-[0.8rem] leading-tight">
              <strong className="block font-titulo text-rojo-600">
                Matrona titulada
              </strong>
              <span className="text-gris">{CONTACTO.registro}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Curva hacia la sección siguiente */}
      <svg
        aria-hidden
        viewBox="0 0 1440 80"
        className="absolute bottom-0 left-0 w-full"
        preserveAspectRatio="none"
      >
        <path d="M0 80V34c260 38 520 46 720 20S1200 0 1440 26v54z" fill="#FDF2F5" />
      </svg>
    </section>
  );
}
