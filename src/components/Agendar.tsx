"use client";

import { useEffect, useMemo, useState } from "react";
import Calendario from "./Calendario";
import { SERVICIOS, precioCLP, CONTACTO, type Servicio } from "@/lib/datos";
import {
  claveFecha, fechaLarga, tieneCupo, bloquesDelDia,
  VENTANA_DIAS, type Bloque,
} from "@/lib/calendario";
import { normalizarTelefono, emailValido, nombreValido, LIMITES } from "@/lib/validacion";

const PASOS = ["Servicio", "Fecha y hora", "Tus datos", "Confirmación"];

const ETIQUETA_MODALIDAD: Record<string, string> = {
  presencial: "Presencial en consulta",
  online: "Online (videollamada)",
};

type Resultado = {
  codigoReserva: string;
  meetUrl?: string;
  vistaPrevia: {
    paciente: { para: string; asunto: string };
    matrona: { para: string; asunto: string };
    enviados: boolean;
  };
};

type Props = {
  /** Dentro del modal se omite el encabezado y el fondo de sección. */
  enModal?: boolean;
  /** Preselecciona un servicio y salta al paso 2. */
  servicioInicial?: string;
  onCerrar?: () => void;
};

export default function Agendar({ enModal, servicioInicial, onCerrar }: Props = {}) {
  const inicial = servicioInicial
    ? (SERVICIOS.find((s) => s.id === servicioInicial) ?? null)
    : null;

  const [paso, setPaso] = useState(inicial ? 1 : 0);
  const [servicio, setServicio] = useState<Servicio | null>(inicial);
  const [modalidad, setModalidad] = useState<string>(
    inicial?.modalidades[0] ?? "presencial"
  );
  const [mes, setMes] = useState(() => {
    const h = new Date();
    return new Date(h.getFullYear(), h.getMonth(), 1);
  });
  const [dia, setDia] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [cargandoHoras, setCargandoHoras] = useState(false);
  const [avisoHoras, setAvisoHoras] = useState<string | null>(null);

  const [form, setForm] = useState({
    nombre: "", email: "", telefono: "", notas: "", consentimiento: false,
  });
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  /* Días con cupo del mes visible — se calcula en cliente para evitar
     un ida y vuelta por cada día. La hora exacta se revalida en el servidor. */
  const diasConCupo = useMemo(() => {
    const set = new Set<string>();
    if (!servicio) return set;

    const año = mes.getFullYear();
    const m = mes.getMonth();
    const total = new Date(año, m + 1, 0).getDate();
    const limite = new Date();
    limite.setDate(limite.getDate() + VENTANA_DIAS);

    for (let d = 1; d <= total; d++) {
      const fecha = new Date(año, m, d);
      if (fecha > limite) break;
      const clave = claveFecha(fecha);
      if (tieneCupo(clave, servicio.duracion)) set.add(clave);
    }
    return set;
  }, [mes, servicio]);

  /* Carga los bloques del día elegido desde la API */
  useEffect(() => {
    if (!dia || !servicio) return;
    let vigente = true;
    setCargandoHoras(true);
    setHora(null);

    fetch(`/api/disponibilidad?fecha=${dia}&servicio=${servicio.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("respuesta no válida");
        return r.json();
      })
      .then((d) => {
        if (vigente) {
          setBloques(d.bloques ?? []);
          setAvisoHoras(null);
        }
      })
      .catch(() => {
        // Respaldo local: muestra el horario base, pero advierte que puede
        // no reflejar reservas recientes.
        if (vigente) {
          setBloques(bloquesDelDia(dia, servicio.duracion));
          setAvisoHoras(
            "No pudimos verificar la disponibilidad en línea. Confirmaremos tu hora por correo."
          );
        }
      })
      .finally(() => {
        if (vigente) setCargandoHoras(false);
      });

    return () => { vigente = false; };
  }, [dia, servicio]);

  function elegirServicio(s: Servicio) {
    setServicio(s);
    setModalidad(s.modalidades[0]);
    setDia(null);
    setHora(null);
    setPaso(1);
  }

  function validar() {
    const e: Record<string, string> = {};
    if (!nombreValido(form.nombre)) e.nombre = "Ingresa tu nombre completo";
    if (!emailValido(form.email)) e.email = "Ingresa un correo válido";
    if (!normalizarTelefono(form.telefono))
      e.telefono = "Ingresa un celular chileno válido";
    if (!form.consentimiento)
      e.consentimiento = "Necesitamos tu autorización para agendar";
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  async function confirmar() {
    if (!validar() || !servicio || !dia || !hora) return;
    setEnviando(true);
    setErrorGlobal(null);

    try {
      const res = await fetch("/api/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicioId: servicio.id,
          fecha: dia,
          hora,
          modalidad: ETIQUETA_MODALIDAD[modalidad],
          ...form,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorGlobal(data.error ?? "No pudimos completar la reserva.");
        if (data.errores) setErrores(data.errores);
        // El cupo se tomó mientras completaba el formulario: volver a elegir hora
        if (res.status === 409) {
          setHora(null);
          setPaso(1);
        }
        return;
      }
      setResultado(data);
      setPaso(3);
    } catch {
      setErrorGlobal("Hubo un problema de conexión. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  }

  function reiniciar() {
    setPaso(0); setServicio(null); setDia(null); setHora(null);
    setBloques([]); setResultado(null); setErrores({}); setErrorGlobal(null);
    setForm({ nombre: "", email: "", telefono: "", notas: "", consentimiento: false });
  }

  const inputCls = (campo: string) =>
    `w-full rounded-xl border-2 bg-white px-4 py-3 text-[0.95rem] outline-none transition-colors ${
      errores[campo]
        ? "border-coral-500"
        : "border-gris-claro focus:border-magenta-500"
    }`;

  const contenido = (
    <>
      {/* Barra de pasos */}
          <ol className="sin-barra flex gap-2 overflow-x-auto border-b border-gris-claro bg-rosa-50 px-5 py-4">
            {PASOS.map((p, i) => (
              <li key={p} className="flex min-w-0 flex-1 items-center gap-2">
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full border-2 font-titulo text-[0.8rem] font-bold transition-colors ${
                    i < paso
                      ? "border-exito-500 bg-exito-500 text-white"
                      : i === paso
                        ? "border-magenta-500 bg-magenta-500 text-white"
                        : "border-gris-claro bg-white text-gris"
                  }`}
                >
                  {i < paso ? "✓" : i + 1}
                </span>
                <span
                  className={`hidden whitespace-nowrap text-[0.82rem] font-semibold sm:block ${
                    i === paso ? "text-magenta-600" : "text-gris"
                  }`}
                >
                  {p}
                </span>
                {i < PASOS.length - 1 && (
                  <span className="hidden h-0.5 min-w-3 flex-1 bg-gris-claro lg:block" />
                )}
              </li>
            ))}
          </ol>

          <div className="px-5 py-8 sm:px-8">
            {/* ---------- Paso 1: servicio ---------- */}
            {paso === 0 && (
              <div className="animate-aparecer">
                <h3 className="text-xl">¿Qué necesitas?</h3>
                <p className="mb-6 text-[0.93rem] text-gris">
                  Selecciona el servicio para ver mi disponibilidad.
                </p>
                <div className="flex flex-col gap-3">
                  {SERVICIOS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => elegirServicio(s)}
                      className="flex w-full items-center gap-4 rounded-2xl border-2 border-gris-claro bg-white p-4 text-left transition-all hover:border-rosa-200 hover:bg-rosa-50"
                    >
                      <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-xl bg-rosa-100 text-xl">
                        {s.icono}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-titulo font-semibold">{s.nombre}</span>
                        <span className="block truncate text-[0.83rem] text-gris">
                          {s.duracion} min ·{" "}
                          {s.modalidades
                            .map((m) => ETIQUETA_MODALIDAD[m].split(" ")[0])
                            .join(" · ")}
                        </span>
                      </span>
                      <span className="whitespace-nowrap font-titulo font-bold text-magenta-600">
                        {precioCLP(s.precio)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ---------- Paso 2: fecha y hora ---------- */}
            {paso === 1 && servicio && (
              <div className="animate-aparecer">
                <h3 className="text-xl">Elige fecha y hora</h3>
                <p className="mb-5 text-[0.93rem] text-gris">
                  {servicio.nombre} · {servicio.duracion} minutos
                </p>

                <div className="mb-5 flex items-center gap-2 rounded-xl border border-exito-500/25 bg-exito-50 px-4 py-3 text-[0.84rem] text-exito-600">
                  <span aria-hidden className="size-2 shrink-0 animate-latido rounded-full bg-exito-500" />
                  Disponibilidad sincronizada con Google Calendar
                </div>

                {servicio.modalidades.length > 1 && (
                  <fieldset className="mb-5">
                    <legend className="mb-2 font-titulo text-[0.9rem] font-semibold">
                      Modalidad de atención
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {servicio.modalidades.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setModalidad(m)}
                          aria-pressed={modalidad === m}
                          className={`rounded-full border-2 px-4 py-2 text-[0.85rem] font-semibold transition-colors ${
                            modalidad === m
                              ? "border-magenta-500 bg-magenta-500 text-white"
                              : "border-gris-claro bg-white text-carbon hover:border-magenta-500"
                          }`}
                        >
                          {ETIQUETA_MODALIDAD[m]}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                <Calendario
                  mes={mes}
                  seleccion={dia}
                  diasConCupo={diasConCupo}
                  onMes={setMes}
                  onDia={setDia}
                />

                {dia && (
                  <div className="mt-6">
                    <p className="mb-3 font-titulo text-[0.95rem] font-semibold">
                      Horarios para el {fechaLarga(dia)}
                    </p>

                    {avisoHoras && (
                      <p className="mb-3 rounded-xl border border-coral-500/30 bg-coral-500/10 p-3 text-[0.83rem] text-coral-600">
                        {avisoHoras}
                      </p>
                    )}

                    {cargandoHoras ? (
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="h-11 animate-pulse rounded-xl bg-rosa-100" />
                        ))}
                      </div>
                    ) : bloques.some((b) => b.libre) ? (
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
                        {bloques.map((b) => (
                          <button
                            key={b.hora}
                            type="button"
                            disabled={!b.libre}
                            onClick={() => setHora(b.hora)}
                            aria-pressed={hora === b.hora}
                            className={`rounded-xl border-2 px-2 py-2.5 text-[0.9rem] font-semibold transition-colors ${
                              hora === b.hora
                                ? "border-magenta-500 bg-magenta-500 text-white"
                                : b.libre
                                  ? "border-gris-claro bg-white hover:border-magenta-500 hover:text-magenta-600"
                                  : "cursor-not-allowed border-gris-claro/50 bg-white text-gris-claro line-through"
                            }`}
                          >
                            {b.hora}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-xl bg-rosa-50 p-5 text-center text-[0.9rem] text-gris">
                        No quedan horas disponibles este día. Elige otra fecha.
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-7 flex flex-wrap justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setPaso(0)}
                    className="rounded-full border-2 border-gris-claro px-6 py-3 font-titulo font-semibold text-gris transition-colors hover:border-carbon hover:text-carbon"
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    disabled={!dia || !hora}
                    onClick={() => setPaso(2)}
                    className="rounded-full bg-magenta-500 px-7 py-3 font-titulo font-semibold text-white transition-all hover:enabled:-translate-y-0.5 hover:enabled:bg-magenta-600 disabled:opacity-40"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* ---------- Paso 3: datos ---------- */}
            {paso === 2 && servicio && dia && hora && (
              <div className="animate-aparecer">
                <h3 className="text-xl">Tus datos</h3>
                <p className="mb-5 text-[0.93rem] text-gris">
                  Los necesito para confirmarte la hora y enviarte la invitación.
                </p>

                <div className="mb-6 rounded-2xl bg-rosa-50 p-5">
                  <p className="mb-3 font-titulo text-[0.9rem] font-semibold text-magenta-600">
                    Resumen de tu reserva
                  </p>
                  <dl className="space-y-2 text-[0.9rem]">
                    {[
                      ["Servicio", servicio.nombre],
                      ["Fecha", fechaLarga(dia)],
                      ["Hora", `${hora} hrs (${servicio.duracion} min)`],
                      ["Modalidad", ETIQUETA_MODALIDAD[modalidad]],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <dt className="text-gris">{k}</dt>
                        <dd className="text-right font-semibold">{v}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between gap-4 border-t border-gris-claro pt-2">
                      <dt className="text-gris">Valor</dt>
                      <dd className="font-titulo text-lg font-bold text-magenta-600">
                        {precioCLP(servicio.precio)}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="nombre" className="mb-1.5 block text-[0.88rem] font-semibold">
                      Nombre completo *
                    </label>
                    <input
                      id="nombre" type="text" autoComplete="name"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      aria-invalid={!!errores.nombre}
                      maxLength={LIMITES.nombre}
                      className={inputCls("nombre")}
                      placeholder="María José Pérez"
                    />
                    {errores.nombre && <p className="mt-1 text-[0.8rem] text-coral-600">{errores.nombre}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-[0.88rem] font-semibold">
                      Correo electrónico *
                    </label>
                    <input
                      id="email" type="email" autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      aria-invalid={!!errores.email}
                      maxLength={LIMITES.email}
                      className={inputCls("email")}
                      placeholder="tucorreo@ejemplo.cl"
                    />
                    {errores.email && <p className="mt-1 text-[0.8rem] text-coral-600">{errores.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="telefono" className="mb-1.5 block text-[0.88rem] font-semibold">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      id="telefono" type="tel" autoComplete="tel"
                      value={form.telefono}
                      onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      aria-invalid={!!errores.telefono}
                      maxLength={LIMITES.telefono}
                      className={inputCls("telefono")}
                      placeholder="+56 9 1234 5678"
                    />
                    {errores.telefono ? (
                      <p className="mt-1 text-[0.8rem] text-coral-600">{errores.telefono}</p>
                    ) : (
                      <p className="mt-1 text-[0.78rem] text-gris">
                        Con o sin +56, como prefieras.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="notas" className="mb-1.5 block text-[0.88rem] font-semibold">
                      Motivo de consulta o algo que deba saber
                      <span className="font-normal text-gris"> (opcional)</span>
                    </label>
                    <textarea
                      id="notas" rows={3}
                      value={form.notas}
                      onChange={(e) => setForm({ ...form, notas: e.target.value })}
                      maxLength={LIMITES.notas}
                      className={`${inputCls("notas")} resize-y`}
                      placeholder="Ej: tengo 12 semanas de embarazo, es mi primer control."
                    />
                  </div>
                </div>

                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border-2 border-gris-claro bg-white p-4 transition-colors has-checked:border-magenta-500 has-checked:bg-rosa-50">
                  <input
                    type="checkbox"
                    checked={form.consentimiento}
                    onChange={(e) => setForm({ ...form, consentimiento: e.target.checked })}
                    className="mt-0.5 size-5 shrink-0 accent-magenta-500"
                  />
                  <span className="text-[0.85rem] leading-relaxed text-gris">
                    Autorizo el tratamiento de mis datos personales y de salud con
                    la finalidad de agendar y gestionar mi atención, según la{" "}
                    <a
                      href="/privacidad"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block py-1 font-semibold text-magenta-600 underline"
                    >
                      política de privacidad
                    </a>
                    . *
                  </span>
                </label>
                {errores.consentimiento && (
                  <p className="mt-1 text-[0.8rem] text-coral-600">{errores.consentimiento}</p>
                )}

                {errorGlobal && (
                  <p role="alert" className="mt-4 rounded-xl border border-coral-500/30 bg-coral-500/10 p-4 text-[0.88rem] text-coral-600">
                    {errorGlobal}
                  </p>
                )}

                <div className="mt-7 flex flex-wrap justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setPaso(1)}
                    disabled={enviando}
                    className="rounded-full border-2 border-gris-claro px-6 py-3 font-titulo font-semibold text-gris transition-colors hover:border-carbon hover:text-carbon"
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={confirmar}
                    disabled={enviando}
                    className="inline-flex items-center gap-2 rounded-full bg-magenta-500 px-7 py-3 font-titulo font-semibold text-white transition-all hover:enabled:-translate-y-0.5 hover:enabled:bg-magenta-600 disabled:opacity-60"
                  >
                    {enviando ? (
                      <>
                        <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Confirmando…
                      </>
                    ) : (
                      "Confirmar reserva"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ---------- Paso 4: confirmación ---------- */}
            {paso === 3 && resultado && servicio && dia && hora && (
              <div className="animate-aparecer text-center">
                <span aria-hidden className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-exito-50 text-3xl">
                  ✓
                </span>
                <h3 className="text-2xl">¡Tu hora está confirmada!</h3>
                <p className="mx-auto mt-2 max-w-md text-[0.95rem] text-gris">
                  Te envié la confirmación a <strong>{form.email}</strong> con la
                  invitación a tu calendario. Nos vemos pronto 🌸
                </p>

                <div className="mx-auto mt-6 max-w-md rounded-2xl bg-rosa-50 p-5 text-left">
                  <dl className="space-y-2 text-[0.9rem]">
                    {[
                      ["Código de reserva", resultado.codigoReserva],
                      ["Servicio", servicio.nombre],
                      ["Fecha", fechaLarga(dia)],
                      ["Hora", `${hora} hrs`],
                      ["Modalidad", ETIQUETA_MODALIDAD[modalidad]],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <dt className="text-gris">{k}</dt>
                        <dd className="text-right font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  {resultado.meetUrl && (
                    <p className="mt-4 border-t border-gris-claro pt-4 text-[0.85rem]">
                      Enlace de videollamada:{" "}
                      <a href={resultado.meetUrl} className="font-semibold text-magenta-600 underline">
                        {resultado.meetUrl}
                      </a>
                    </p>
                  )}
                </div>

                {/* Aviso de demo — mostrar en vivo qué correos saldrían */}
                <div className="mx-auto mt-5 max-w-md rounded-2xl border-2 border-dashed border-magenta-500/35 bg-white p-4 text-left">
                  <p className="mb-2 font-titulo text-[0.8rem] font-semibold uppercase tracking-wider text-magenta-600">
                    Vista previa · modo demo
                  </p>
                  <p className="mb-3 text-[0.82rem] text-gris">
                    En producción se enviarían automáticamente estos dos correos y
                    se crearía el evento en Google Calendar:
                  </p>
                  <ul className="space-y-2 text-[0.8rem]">
                    <li className="rounded-lg bg-rosa-50 p-3">
                      <strong className="block text-carbon">→ A la paciente</strong>
                      <span className="text-gris">{resultado.vistaPrevia.paciente.para}</span>
                      <br />
                      <span className="text-gris">{resultado.vistaPrevia.paciente.asunto}</span>
                    </li>
                    <li className="rounded-lg bg-rosa-50 p-3">
                      <strong className="block text-carbon">→ A la matrona</strong>
                      <span className="text-gris">{resultado.vistaPrevia.matrona.para}</span>
                      <br />
                      <span className="text-gris">{resultado.vistaPrevia.matrona.asunto}</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <a
                    href={`https://wa.me/${CONTACTO.telefono.replace(/\D/g, "")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="rounded-full border-2 border-magenta-500 px-6 py-3 font-titulo font-semibold text-magenta-600 transition-colors hover:bg-magenta-500 hover:text-white"
                  >
                    Escribirme por WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={reiniciar}
                    className="rounded-full bg-magenta-500 px-6 py-3 font-titulo font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-magenta-600"
                  >
                    Agendar otra hora
                  </button>
                </div>
              </div>
            )}
      </div>
    </>
  );

  // Dentro del modal va sin encabezado ni fondo de sección
  if (enModal) {
    return (
      <div className="overflow-hidden rounded-3xl">
        <h2 id="titulo-agenda" className="sr-only">
          Reserva tu hora
        </h2>
        {contenido}
      </div>
    );
  }

  return (
    <section id="agendar" className="bg-rosa-100 py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-5">
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block font-titulo text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-coral-500">
            Agenda online
          </span>
          <h2 className="text-[clamp(1.7rem,3.2vw,2.2rem)]">Reserva tu hora</h2>
        </div>
        <div className="overflow-hidden rounded-3xl border border-gris-claro bg-white shadow-media">
          {contenido}
        </div>
      </div>
    </section>
  );
}
