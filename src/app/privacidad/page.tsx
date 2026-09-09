import type { Metadata } from "next";
import PaginaLegal from "@/components/PaginaLegal";
import { CONTACTO, SEDES } from "@/lib/datos";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo tratamos y protegemos tus datos personales y de salud conforme a la Ley 21.719.",
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

export default function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad" actualizado="agosto de 2026">
      <div className="rounded-2xl border-2 border-dashed border-magenta-500/35 bg-rosa-50 p-4">
        <p className="text-[0.86rem] text-gris">
          <strong className="text-carbon">Nota del demo:</strong> este texto es un
          borrador de referencia. Antes de publicar el sitio debe ser revisado por
          un abogado, ya que se trata de datos sensibles de salud regulados por la
          Ley 21.719.
        </p>
      </div>

      <P>
        Esta política describe cómo {CONTACTO.nombre}, matrona, recolecta, usa y
        protege los datos personales que entregas al usar este sitio web y al
        agendar una atención.
      </P>

      <H>1. Responsable del tratamiento</H>
      <P>
        {CONTACTO.nombre}, matrona, con consulta en{" "}
        {SEDES.map((s) => `${s.centro}, ${s.ciudad}`).join(" y ")}. Puedes
        contactarme en {CONTACTO.email} o al {CONTACTO.telefonoDisplay}.
      </P>

      <H>2. Qué datos recolectamos</H>
      <UL items={[
        "Datos de identificación: nombre completo, correo electrónico y teléfono.",
        "Datos de la reserva: servicio solicitado, fecha, hora y modalidad de atención.",
        "Datos de salud: el motivo de consulta que decidas indicar al agendar, y la información clínica que se registre durante la atención.",
        "Datos técnicos: dirección IP y datos de navegación necesarios para el funcionamiento del sitio.",
      ]} />

      <H>3. Para qué usamos tus datos</H>
      <UL items={[
        "Agendar, confirmar y gestionar tu hora de atención.",
        "Enviarte la confirmación de tu cita y un recordatorio 24 horas antes.",
        "Crear el evento en el calendario profesional e invitarte a él.",
        "Prestar la atención de salud y mantener tu ficha clínica, conforme a la normativa sanitaria vigente.",
        "Responder tus consultas por los canales de contacto habilitados.",
      ]} />
      <P>
        No usamos tus datos con fines publicitarios ni los cedemos a terceros con
        fines comerciales.
      </P>

      <H>4. Base de licitud</H>
      <P>
        El tratamiento de tus datos se funda en el consentimiento expreso que
        otorgas al agendar, y en el cumplimiento de las obligaciones legales
        asociadas a la prestación de servicios de salud y a la mantención de la
        ficha clínica.
      </P>

      <H>5. Con quién compartimos tus datos</H>
      <UL items={[
        "Google (Google Calendar): para crear el evento de tu cita y enviarte la invitación.",
        "Proveedor de correo transaccional: para enviarte la confirmación y el recordatorio.",
        "Pasarela de pago: si eliges pagar online, procesa el pago sin que yo almacene los datos de tu tarjeta.",
        "Autoridades competentes, cuando exista una obligación legal de informar.",
      ]} />

      <H>6. Cuánto tiempo los conservamos</H>
      <P>
        Los datos de la reserva se conservan mientras dure la relación asistencial.
        La ficha clínica se conserva por el plazo que exige la normativa sanitaria.
        Los datos de contacto de consultas no concretadas se eliminan al cabo de
        doce meses.
      </P>

      <H>7. Tus derechos</H>
      <P>
        Puedes ejercer en cualquier momento tus derechos de acceso, rectificación,
        supresión, oposición, portabilidad y bloqueo escribiendo a{" "}
        <a href={`mailto:${CONTACTO.email}`} className="inline-flex min-h-11 items-center font-semibold text-magenta-600 underline">
          {CONTACTO.email}
        </a>
        . Responderemos dentro de los plazos legales. También puedes reclamar ante
        la Agencia de Protección de Datos Personales.
      </P>

      <H>8. Seguridad</H>
      <P>
        El sitio opera sobre conexión cifrada (HTTPS). El acceso a los datos está
        restringido exclusivamente a la profesional a cargo de tu atención, quien
        está sujeta a secreto profesional.
      </P>

      <H>9. Cookies</H>
      <P>
        Este sitio utiliza solo las cookies técnicas necesarias para su
        funcionamiento. No empleamos cookies de publicidad ni de seguimiento de
        terceros.
      </P>
    </PaginaLegal>
  );
}
