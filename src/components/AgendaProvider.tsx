"use client";

import {
  createContext, useCallback, useContext, useEffect, useState,
} from "react";
import ModalAgenda from "./ModalAgenda";

type Ctx = {
  abrir: (servicioId?: string) => void;
  cerrar: () => void;
};

const AgendaCtx = createContext<Ctx | null>(null);

/** Abre el modal de agendamiento desde cualquier punto del sitio. */
export function useAgenda(): Ctx {
  const ctx = useContext(AgendaCtx);
  if (!ctx) throw new Error("useAgenda debe usarse dentro de <AgendaProvider>");
  return ctx;
}

export default function AgendaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [abierto, setAbierto] = useState(false);
  const [servicioInicial, setServicioInicial] = useState<string | undefined>();

  const abrir = useCallback((servicioId?: string) => {
    setServicioInicial(servicioId);
    setAbierto(true);
  }, []);

  const cerrar = useCallback(() => setAbierto(false), []);

  /* Permite abrir con /#agendar y que el enlace siga funcionando
     si alguien comparte la URL o llega desde fuera. */
  useEffect(() => {
    const revisarHash = () => {
      if (window.location.hash === "#agendar") {
        setAbierto(true);
        // Limpia el hash para que se pueda volver a abrir con el mismo enlace
        history.replaceState(null, "", window.location.pathname);
      }
    };
    revisarHash();
    window.addEventListener("hashchange", revisarHash);
    return () => window.removeEventListener("hashchange", revisarHash);
  }, []);

  return (
    <AgendaCtx.Provider value={{ abrir, cerrar }}>
      {children}
      <ModalAgenda abierto={abierto} onCerrar={cerrar} servicioInicial={servicioInicial} />
    </AgendaCtx.Provider>
  );
}
