"use client";

import { useState } from "react";
import { fechaLarga } from "@/lib/calendario";

type Props = {
  token: string;
  cita: { fecha: string; hora: string };
};

export default function FormularioRechazo({ token, cita }: Props) {
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState<null | "hecho" | "yaResuelta" | "error">(null);

  async function rechazar() {
    setEnviando(true);
    try {
      const r = await fetch("/api/cita/rechazar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, motivo: motivo.trim() || undefined }),
      });
      const d = await r.json();
      setListo(r.ok ? (d.yaResuelta ? "yaResuelta" : "hecho") : "error");
    } catch {
      setListo("error");
    } finally {
      setEnviando(false);
    }
  }

  if (listo === "hecho") {
    return (
      <>
        <span aria-hidden className="mb-4 block text-4xl">✓</span>
        <h1 className="text-xl">Hora rechazada</h1>
        <p className="mt-2 text-[0.93rem] leading-relaxed text-gris">
          Le avisamos a la paciente y el horario volvió a quedar disponible.
        </p>
      </>
    );
  }

  if (listo === "yaResuelta") {
    return (
      <>
        <span aria-hidden className="mb-4 block text-4xl">👍</span>
        <h1 className="text-xl">Esta hora ya estaba resuelta</h1>
        <p className="mt-2 text-[0.93rem] leading-relaxed text-gris">
          No hicimos nada: ya la habías confirmado o rechazado antes.
        </p>
      </>
    );
  }

  if (listo === "error") {
    return (
      <>
        <span aria-hidden className="mb-4 block text-4xl">⚠️</span>
        <h1 className="text-xl">No pudimos completar la acción</h1>
        <p className="mt-2 text-[0.93rem] leading-relaxed text-gris">
          Vuelve a intentarlo, o gestiona la cita directamente desde tu Google
          Calendar.
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-xl">¿Rechazar esta hora?</h1>
      <p className="mt-2 text-[0.93rem] leading-relaxed text-gris">
        {fechaLarga(cita.fecha)} a las {cita.hora} hrs. El horario volverá a
        quedar disponible.
      </p>

      <label className="mt-6 block text-left">
        <span className="mb-1.5 block font-titulo text-[0.88rem] font-semibold">
          Motivo para la paciente{" "}
          <span className="font-normal text-gris">(opcional)</span>
        </span>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder="Por ejemplo: ese día tengo una urgencia. ¿Te acomoda el jueves?"
          className="w-full rounded-xl border-2 border-gris-claro p-3 text-[0.9rem] focus:border-magenta-500 focus:outline-none"
        />
      </label>

      <button
        type="button"
        onClick={rechazar}
        disabled={enviando}
        className="mt-5 w-full rounded-full bg-coral-600 px-7 py-3.5 font-titulo font-semibold text-white transition-colors hover:bg-coral-500 disabled:opacity-50"
      >
        {enviando ? "Enviando…" : "Rechazar y avisar"}
      </button>
    </>
  );
}
