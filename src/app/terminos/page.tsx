import type { Metadata } from "next";
import PaginaLegal from "@/components/PaginaLegal";
import { CONTACTO, SEDES } from "@/lib/datos";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Condiciones de uso del sitio y de las atenciones agendadas.",
  robots: { index: false, follow: true },
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-2 mt-8 font-titulo text-xl">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 text-[0.95rem] leading-relaxed text-gris">{children}</p>
);
const UL = ({ items }: { items: string[] }) => (
  <ul className="mb-3 space-y-2">
    {items.map((i) => (
      <li key={i} className="relative pl-6 text-[0.95rem] leading-relaxed text-gris">
        <span aria-hidden className="absolute left-0 font-bold text-magenta-500">•</span>
        {i}
      </li>
    ))}
  </ul>
);

export default function Terminos() {
  return (
    <PaginaLegal titulo="Términos y condiciones" actualizado="agosto de 2026">
      <div className="rounded-2xl border-2 border-dashed border-magenta-500/35 bg-rosa-50 p-4">
        <p className="text-[0.86rem] text-gris">
          <strong className="text-carbon">Nota del demo:</strong> texto de
          referencia. Debe ajustarse a las condiciones reales de la consulta antes
          de publicar.
        </p>
      </div>

      <H>1. Servicios</H>
      <P>
        Este sitio permite conocer y pre-agendar atenciones de matronería
        prestadas por {CONTACTO.nombre}, matrona titulada, en{" "}
        {SEDES.map((s) => s.ciudad).join(" y ")} o por telemedicina, según el
        servicio elegido.
      </P>

      <H>2. Agendamiento</H>
      <UL items={[
        "La reserva es una pre-agenda: la hora queda confirmada solo una vez recibido el comprobante del pago anticipado.",
        "Los horarios mostrados reflejan la disponibilidad real de la agenda profesional.",
        "Es responsabilidad de la paciente entregar datos de contacto correctos y vigentes.",
        "Se recomienda llegar cinco minutos antes de la hora agendada.",
      ]} />

      <H>3. Cancelaciones y cambios</H>
      <UL items={[
        "Puedes reprogramar o cancelar sin costo hasta 24 horas antes de tu cita.",
        "Con menos de 24 horas de aviso, se retiene el 50% del valor de la consulta, porque el horario reservado para ti no puede reasignarse a otra paciente y existen costos operativos asociados.",
        "Al realizar el pago para reservar la hora, se entiende aceptada esta política.",
        "Si debo cancelar por razones de fuerza mayor, te reagendaré con prioridad o te devolveré el 100% de lo pagado.",
      ]} />

      <H>4. Valores y pagos</H>
      <UL items={[
        "Los valores publicados están en pesos chilenos e incluyen impuestos.",
        "El pago se realiza por transferencia electrónica, de forma anticipada.",
        "La atención es particular: no cuento con convenio Fonasa ni Isapre.",
        "Se considera control hasta 60 días después de la atención; pasado ese plazo corresponde agendar como primera consulta.",
        "La revisión de exámenes es gratuita hasta 7 días corridos desde la entrega de las órdenes.",

      ]} />

      <H>5. Atención por telemedicina</H>
      <P>
        La atención online es apta para consejerías, seguimiento e interpretación
        de exámenes. Si durante la consulta se determina que requieres examen
        físico o un procedimiento, se coordinará una atención presencial en
        Talca o Linares.
      </P>

      <H>6. Alcance de la atención</H>
      <P>
        La matrona actúa dentro del ámbito de competencias que le confiere el
        Código Sanitario. Cuando el caso lo requiera, se realizará la derivación
        oportuna al profesional médico correspondiente. Este sitio no presta
        atención de urgencia: ante una emergencia, acude al servicio de urgencia
        más cercano o llama al 131.
      </P>

      <H>7. Propiedad intelectual</H>
      <P>
        Los contenidos, textos e imágenes de este sitio son de propiedad de{" "}
        {CONTACTO.nombre} y no pueden reproducirse sin autorización previa.
      </P>

      <H>8. Modificaciones</H>
      <P>
        No realizo ecografías en consulta, pero sí entrego la orden
        correspondiente. Los procedimientos de inserción de implante o
        dispositivo intrauterino requieren una consejería previa obligatoria.
      </P>
      <P>
        Estos términos pueden actualizarse. La versión vigente es siempre la
        publicada en esta página, con su fecha de última actualización.
      </P>
    </PaginaLegal>
  );
}
