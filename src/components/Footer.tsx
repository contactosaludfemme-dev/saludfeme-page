import { CONTACTO, SEDES } from "@/lib/datos";
import LogoSaludFemme from "./LogoSaludFemme";

export default function Footer() {
  const año = 2026; // fijo: evita desajuste de hidratación

  return (
    <footer className="bg-carbon pb-32 pt-10 text-white/70 md:pb-14 md:pt-14">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <LogoSaludFemme claro className="h-12" />
              <span className="min-w-0 border-l border-white/20 pl-3">
                <strong className="block font-titulo text-[0.95rem] text-white md:text-base">
                  {CONTACTO.nombre}
                </strong>
                <span className="text-[0.75rem] uppercase tracking-[0.14em] text-rosa-200">
                  {CONTACTO.profesion}
                </span>
              </span>
            </div>
            <p className="hidden max-w-sm text-[0.88rem] leading-relaxed md:block">
              Un espacio de atención cercano, respetuoso y sin juicios, enfocado
              en la salud integral de la mujer.
            </p>
            <p className="text-[0.8rem] text-white/50 md:mt-3">{CONTACTO.registro}</p>
          </div>

          <nav aria-label="Enlaces del sitio">
            <h2 className="mb-2 font-titulo text-[0.95rem] text-white md:mb-3">Navegación</h2>
            <ul className="grid grid-cols-2 gap-x-4 text-[0.88rem] md:grid-cols-1 md:space-y-2">
              {[
                ["#servicios", "Servicios"],
                ["#modalidades", "Modalidades"],
                ["#sobre-mi", "Sobre mí"],
                ["#testimonios", "Testimonios"],
                ["#preguntas", "Preguntas frecuentes"],
                ["/blog", "Blog"],
                ["#agendar", "Agendar hora"],
              ].map(([h, t]) => (
                <li key={h}>
                  <a
                    href={h}
                    className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-rosa-200 md:min-h-0 md:min-w-0"
                  >
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-2 font-titulo text-[0.95rem] text-white md:mb-3">Contacto</h2>
            <ul className="text-[0.88rem] md:space-y-2">
              {SEDES.map((sede) => (
                <li key={sede.id}>
                  <strong className="font-semibold text-white/90">
                    {sede.ciudad}
                  </strong>{" "}
                  · {sede.centro}
                </li>
              ))}
              <li>Online a todo Chile</li>
              <li>
                <a
                  href={`https://wa.me/${CONTACTO.telefono.replace(/\D/g, "")}`}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-rosa-200 md:min-h-0"
                >
                  {CONTACTO.telefonoDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACTO.email}`}
                  className="inline-flex min-h-11 items-center break-all transition-colors hover:text-rosa-200 md:min-h-0"
                >
                  {CONTACTO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-7 border-t border-white/10 pt-5 md:mt-10 md:pt-6">
          <p className="mb-3 rounded-xl bg-white/5 p-3.5 text-[0.8rem] leading-relaxed text-white/60 md:hidden">
            <strong className="text-white/80">Importante:</strong> este sitio no
            reemplaza una consulta profesional. Ante una urgencia, acude al
            servicio de urgencia más cercano o llama al <strong>131</strong>.
          </p>
          <p className="mb-3 hidden rounded-xl bg-white/5 p-4 text-[0.8rem] leading-relaxed text-white/60 md:block">
            <strong className="text-white/80">Importante:</strong> la información
            de este sitio es orientativa y no reemplaza una consulta profesional.
            Ante una urgencia obstétrica o ginecológica —sangrado abundante, dolor
            intenso, pérdida de líquido o disminución de movimientos fetales—
            acude al servicio de urgencia más cercano o llama al <strong>131</strong>.
          </p>
          <div className="flex flex-col items-center justify-between gap-3 text-[0.8rem] sm:flex-row">
            <p>© {año} {CONTACTO.marca}. Todos los derechos reservados.</p>
            <nav aria-label="Legal" className="flex gap-4">
              <a
                href="/privacidad"
                className="inline-flex min-h-11 items-center transition-colors hover:text-rosa-200 md:min-h-0"
              >
                Política de privacidad
              </a>
              <a
                href="/terminos"
                className="inline-flex min-h-11 items-center transition-colors hover:text-rosa-200 md:min-h-0"
              >
                Términos y condiciones
              </a>
            </nav>
          </div>

          {/* Crédito de diseño y desarrollo */}
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-white/10 pt-4 md:mt-6 md:pt-5 text-center text-[0.82rem] text-white/55">
            Diseñado y desarrollado por
            <a
              href="https://my-portfolio-three-eta-88.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 font-titulo font-semibold text-rosa-200 transition-all hover:border-magenta-400 hover:bg-magenta-500/15 hover:text-white"
            >
              karcabcas
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
              <span className="sr-only">(abre mi portafolio en una pestaña nueva)</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
