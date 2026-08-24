"use client";

import { useEffect, useState } from "react";
import { CONTACTO } from "@/lib/datos";

const IconoUbicacion = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconoReloj = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
);
const IconoWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.6-1.5-.9-2.1-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.2-.5-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
  </svg>
);
const IconoInstagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/** ¿Está dentro del horario de atención ahora mismo? */
function estaAbierta(): boolean {
  const ahora = new Date();
  const dia = ahora.getDay(); // 0 = domingo
  const hora = ahora.getHours() + ahora.getMinutes() / 60;
  if (dia === 0) return false;
  if (dia === 6) return hora >= 10 && hora < 14;
  if (dia === 5) return hora >= 9 && hora < 15;
  return hora >= 9 && hora < 19;
}

export default function Contacto() {
  const [horarios, setHorarios] = useState(false);
  const [verMapa, setVerMapa] = useState(false);
  // En escritorio el mapa se monta solo; en móvil espera un toque.
  // `hidden` no basta: el navegador descarga el iframe igual.
  const [esEscritorio, setEsEscritorio] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setEsEscritorio(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  // Se calcula al montar, en el cliente: evita desajuste de hidratación
  const [abiertaAhora, setAbiertaAhora] = useState(false);
  useEffect(() => setAbiertaAhora(estaAbierta()), []);

  // Recuadro del mapa alrededor de la consulta
  const { lat, lng } = CONTACTO.coordenadas;
  const d = 0.012;
  const bbox = [lng - d, lat - d, lng + d, lat + d].join(",");
  const mapaSrc =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${encodeURIComponent(bbox)}&layer=mapnik` +
    `&marker=${encodeURIComponent(`${lat},${lng}`)}`;

  const wa = `https://wa.me/${CONTACTO.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hola Francisca, vengo de tu página web y quiero agendar una hora 🌸"
  )}`;

  return (
    <section id="contacto" className="bg-rosa-50 pb-24 pt-16 sm:pb-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto mb-7 max-w-2xl text-center md:mb-12">
          <span className="mb-3 inline-block font-titulo text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-coral-500">
            Dónde encontrarme
          </span>
          <h2 className="text-[clamp(1.7rem,3.2vw,2.4rem)]">Contacto y ubicación</h2>
          <p className="mt-2 text-[0.93rem] text-gris md:mt-3 md:text-base">
            Escríbeme por el canal que prefieras. Respondo por orden de llegada.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Datos */}
          <div className="space-y-3 md:space-y-4">
            <div className="rounded-2xl border border-gris-claro bg-white p-4 shadow-suave md:rounded-3xl md:p-6">
              <div className="flex items-start gap-3 md:mb-4 md:gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-rosa-100 text-magenta-600 md:size-11 md:rounded-xl">
                  <IconoUbicacion />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-0.5 text-[0.98rem] md:mb-1 md:text-base">Consulta</h3>
                  <p className="text-[0.88rem] leading-snug text-gris md:mb-2 md:text-[0.9rem]">
                    {CONTACTO.direccion} · {CONTACTO.comuna}
                  </p>
                  <a
                    href={CONTACTO.mapaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-[0.86rem] font-semibold text-magenta-600 underline md:text-[0.88rem]"
                  >
                    Ver en Google Maps
                  </a>
                </div>
              </div>

              {/* Horarios: colapsados en móvil, siempre visibles en escritorio */}
              <div className="border-t border-gris-claro pt-3 md:flex md:items-start md:gap-4 md:pt-4">
                <span className="hidden size-11 shrink-0 place-items-center rounded-xl bg-rosa-100 text-magenta-600 md:grid">
                  <IconoReloj />
                </span>
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => setHorarios((v) => !v)}
                    aria-expanded={horarios}
                    className="flex min-h-11 w-full items-center justify-between gap-3 text-left md:pointer-events-none md:min-h-0"
                  >
                    <span className="flex items-center gap-3 md:gap-0">
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-rosa-100 text-magenta-600 md:hidden">
                        <IconoReloj />
                      </span>
                      <span>
                        <span className="block font-titulo text-[0.98rem] font-bold md:text-base">
                          Horarios
                        </span>
                        <span className="text-[0.82rem] text-gris md:hidden">
                          {abiertaAhora ? "Abierta ahora" : "Ver horarios de atención"}
                        </span>
                      </span>
                    </span>
                    <svg
                      width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                      aria-hidden
                      className={`shrink-0 text-magenta-600 transition-transform md:hidden ${horarios ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  <dl className={`space-y-1 text-[0.86rem] md:mt-2 md:block md:text-[0.88rem] ${horarios ? "mt-3 block" : "hidden"}`}>
                    {CONTACTO.horarios.map((h) => (
                      <div key={h.dia} className="flex justify-between gap-3">
                        <dt className="text-gris">{h.dia}</dt>
                        <dd className="font-semibold">{h.hora}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            {/* WhatsApp e Instagram: lado a lado en móvil */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-4">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-start gap-2 rounded-2xl bg-[#25D366] p-4 text-white shadow-suave transition-transform hover:-translate-y-0.5 md:flex-row md:items-center md:gap-4 md:rounded-3xl md:p-5"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/20 md:size-11 md:rounded-xl">
                  <IconoWhatsApp />
                </span>
                <span className="min-w-0">
                  <strong className="block font-titulo text-[0.95rem]">WhatsApp</strong>
                  <span className="block truncate text-[0.8rem] text-white/90 md:text-[0.88rem]">
                    {CONTACTO.telefonoDisplay}
                  </span>
                </span>
              </a>

              <a
                href={`https://instagram.com/${CONTACTO.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-start gap-2 rounded-2xl bg-gradient-to-br from-magenta-500 to-coral-500 p-4 text-white shadow-suave transition-transform hover:-translate-y-0.5 md:flex-row md:items-center md:gap-4 md:rounded-3xl md:p-5"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/20 md:size-11 md:rounded-xl">
                  <IconoInstagram />
                </span>
                <span className="min-w-0">
                  <strong className="block font-titulo text-[0.95rem]">Instagram</strong>
                  <span className="block truncate text-[0.8rem] text-white/90 md:text-[0.88rem]">
                    @{CONTACTO.instagram}
                  </span>
                </span>
              </a>
            </div>
          </div>

          {/* Mapa: en móvil se carga solo al tocarlo (ahorra 384px y datos) */}
          <div className="overflow-hidden rounded-2xl border border-gris-claro bg-white shadow-suave md:min-h-[24rem] md:rounded-3xl">
            {verMapa || esEscritorio ? (
              <iframe
                title="Ubicación de la consulta"
                src={mapaSrc}
                className="h-64 w-full border-0 md:size-full md:min-h-[24rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setVerMapa(true)}
                  className="flex min-h-11 w-full items-center justify-center gap-2 p-4 font-titulo text-[0.9rem] font-semibold text-magenta-600 md:hidden"
                >
                  <IconoUbicacion />
                  Ver mapa de la consulta
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
