/**
 * Datos del sitio — fuente única de verdad.
 * Editar aquí precios, servicios, horarios y textos.
 */

/** URL pública del sitio. DEMO: cambiar por el dominio real al publicar. */
export const SITIO_URL = "https://saludfemme.cl";

export const CONTACTO = {
  nombre: "Francisca Carrillo",
  profesion: "Matrona",
  registro: "Reg. Superintendencia de Salud N° 123456", // DEMO: reemplazar
  telefono: "+56988213371",
  telefonoDisplay: "+56 9 8821 3371",
  email: "contacto@saludfemme.cl", // DEMO: confirmar correo real
  instagram: "saludfemme.matrona",
  direccion: "1 Sur 1234, Of. 502", // DEMO: confirmar dirección real
  comuna: "Talca, Región del Maule",
  mapaUrl: "https://maps.google.com/?q=1+Sur+1234+Talca+Chile",
  /** Coordenadas del centro de Talca — ajustar a la ubicación exacta. */
  coordenadas: { lat: -35.4264, lng: -71.6554 },
  horarios: [
    { dia: "Lunes a Jueves", hora: "09:00 – 19:00" },
    { dia: "Viernes", hora: "09:00 – 15:00" },
    { dia: "Sábado", hora: "10:00 – 14:00" },
    { dia: "Domingo y festivos", hora: "Cerrado" },
  ],
} as const;

export type Servicio = {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  incluye: string[];
  precio: number;
  duracion: number; // minutos
  modalidades: ("presencial" | "online")[];
};

export const SERVICIOS: Servicio[] = [
  {
    id: "control-prenatal",
    nombre: "Control prenatal",
    icono: "🤰",
    descripcion:
      "Seguimiento integral de tu embarazo, con acompañamiento cercano en cada etapa y resolución de todas tus dudas.",
    incluye: [
      "Control de peso y presión arterial",
      "Medición de altura uterina",
      "Auscultación de latidos fetales",
      "Solicitud e interpretación de exámenes",
      "Educación según semana de gestación",
    ],
    precio: 35000,
    duracion: 45,
    modalidades: ["presencial", "online"],
  },
  {
    id: "control-ginecologico",
    nombre: "Control ginecológico y PAP",
    icono: "🌸",
    descripcion:
      "Control preventivo anual en un espacio de confianza, sin juicios y a tu ritmo.",
    incluye: [
      "Anamnesis y examen físico",
      "Toma de Papanicolau (PAP)",
      "Examen físico de mamas",
      "Consejería en salud sexual",
      "Entrega e interpretación de resultados",
    ],
    precio: 30000,
    duracion: 40,
    modalidades: ["presencial"],
  },
  {
    id: "anticoncepcion",
    nombre: "Consejería en anticoncepción",
    icono: "💊",
    descripcion:
      "Elegimos juntas el método que mejor se adapta a tu cuerpo, tu etapa y tu proyecto de vida.",
    incluye: [
      "Evaluación de antecedentes de salud",
      "Revisión de todos los métodos disponibles",
      "Inserción de DIU o implante (valor aparte)",
      "Control post-inserción incluido",
      "Seguimiento de efectos adversos",
    ],
    precio: 28000,
    duracion: 40,
    modalidades: ["presencial", "online"],
  },
  {
    id: "preparacion-parto",
    nombre: "Preparación para el parto",
    icono: "🧘‍♀️",
    descripcion:
      "Llega al parto con información, herramientas y confianza. Sesiones personalizadas para ti y tu acompañante.",
    incluye: [
      "Fisiología del trabajo de parto",
      "Técnicas de respiración y relajación",
      "Manejo del dolor sin fármacos",
      "Construcción de tu plan de parto",
      "Rol del acompañante",
    ],
    precio: 40000,
    duracion: 60,
    modalidades: ["presencial", "online"],
  },
  {
    id: "postparto-lactancia",
    nombre: "Control postparto y lactancia",
    icono: "🤱",
    descripcion:
      "Acompañamiento en el puerperio y asesoría especializada en lactancia materna, cuando más lo necesitas.",
    incluye: [
      "Evaluación de recuperación postparto",
      "Revisión de técnica y acople",
      "Manejo de grietas y dolor",
      "Evaluación de aumento de peso del bebé",
      "Apoyo emocional en el puerperio",
    ],
    precio: 38000,
    duracion: 60,
    modalidades: ["presencial"],
  },
  {
    id: "climaterio",
    nombre: "Salud en climaterio",
    icono: "🌺",
    descripcion:
      "Acompañamiento en la perimenopausia y menopausia para vivir esta etapa con bienestar.",
    incluye: [
      "Evaluación de síntomas climatéricos",
      "Consejería en salud ósea",
      "Manejo de bochornos e insomnio",
      "Salud sexual en esta etapa",
      "Derivación oportuna si se requiere",
    ],
    precio: 32000,
    duracion: 45,
    modalidades: ["presencial", "online"],
  },
];

export type Programa = {
  id: string;
  nombre: string;
  icono: string;
  /** Ritmo del acompañamiento, en lenguaje humano. */
  ritmo: string;
  /** Una línea que resume el programa en la vista colapsada. */
  resumen: string;
  /** Cómo se vive el proceso, en primera persona (al desplegar). */
  relato: string;
  incluye: string[];
  precio: number;
  /** Suma de las sesiones por separado, para dar contexto al valor. */
  precioSuelto: number;
};

export const PROGRAMAS: Programa[] = [
  {
    id: "acompanamiento-embarazo",
    nombre: "Acompañamiento durante el embarazo",
    icono: "🤰",
    ritmo: "8 encuentros · desde tu primer control hasta después del parto",
    resumen:
      "Todo tu embarazo acompañado, con WhatsApp directo entre controles.",
    relato:
      "Nos vemos una vez al mes, y en las últimas semanas cada quince días. " +
      "Entre control y control me escribes cuando lo necesites: para eso está " +
      "el WhatsApp directo. Llegamos juntas al parto con tu plan escrito y " +
      "todas tus dudas conversadas.",
    incluye: [
      "8 controles prenatales de 45 minutos",
      "Una sesión de preparación para el parto",
      "Tu plan de parto por escrito",
      "WhatsApp directo entre controles",
      "Control postparto incluido",
    ],
    precio: 240000,
    precioSuelto: 280000,
  },
  {
    id: "acompanamiento-parto",
    nombre: "Preparación para tu parto",
    icono: "🧘‍♀️",
    ritmo: "5 encuentros · desde la semana 28",
    resumen:
      "Para llegar al parto con información y tu acompañante preparado.",
    relato:
      "Cinco sesiones para llegar al parto sabiendo qué esperar y qué puedes " +
      "decidir. Tu acompañante participa en todas: cuando los dos entienden " +
      "lo que viene, el día del parto se vive muy distinto. Quedamos en " +
      "contacto directo hasta que nazca.",
    incluye: [
      "5 sesiones de 60 minutos",
      "Participación de tu acompañante",
      "Fisiología del parto y manejo del dolor",
      "Tu plan de parto por escrito",
      "Contacto directo hasta el parto",
    ],
    precio: 170000,
    precioSuelto: 200000,
  },
  {
    id: "acompanamiento-lactancia",
    nombre: "Acompañamiento en lactancia",
    icono: "🤱",
    ritmo: "4 encuentros · durante los primeros dos meses",
    resumen:
      "Acompañamiento en los primeros dos meses, cuando más se necesita.",
    relato:
      "Nos vemos por primera vez dentro de la primera semana, que es cuando " +
      "más se necesita, y después según cómo vayan tú y tu bebé. Revisamos el " +
      "acople, el peso y lo que te esté costando, sin apuro. Entre sesiones " +
      "me escribes cuando surja una duda.",
    incluye: [
      "4 sesiones de 60 minutos",
      "Primera sesión dentro de la primera semana",
      "Evaluación de técnica y acople",
      "Seguimiento del peso de tu bebé",
      "WhatsApp directo entre sesiones",
    ],
    precio: 130000,
    precioSuelto: 152000,
  },
];

export const MODALIDADES = [
  {
    icono: "🏥",
    nombre: "Presencial",
    descripcion:
      "En mi consulta en Talca, con todo el equipamiento necesario para tu control, exámenes y procedimientos.",
  },
  {
    icono: "💻",
    nombre: "Telemedicina",
    descripcion:
      "Por videollamada, para consejerías, revisión de exámenes, seguimiento y todas las dudas que surjan entre controles.",
  },
];

export const MEDIOS_PAGO = [
  "Webpay",
  "Tarjetas de crédito",
  "Tarjetas de débito",
  "Efectivo en consulta",
];

export const TESTIMONIOS = [
  {
    nombre: "Camila R.",
    servicio: "Control prenatal",
    texto:
      "Francisca me acompañó durante todo mi embarazo. Nunca sentí que una pregunta fuera tonta. Llegué al parto tranquila y segura, y eso se lo debo a ella.",
    estrellas: 5,
  },
  {
    nombre: "Daniela M.",
    servicio: "Asesoría en lactancia",
    texto:
      "Estaba a punto de rendirme con la lactancia por el dolor. En una sesión corrigió el acople y todo cambió. Ojalá la hubiera contactado antes.",
    estrellas: 5,
  },
  {
    nombre: "Josefa V.",
    servicio: "Consejería anticonceptiva",
    texto:
      "Por primera vez alguien me explicó todas las opciones sin apurarme ni presionarme. Me sentí escuchada y respetada de verdad.",
    estrellas: 5,
  },
  {
    nombre: "Antonia P.",
    servicio: "Preparación para el parto",
    texto:
      "Las sesiones con mi pareja fueron clave. Él llegó al parto sabiendo cómo apoyarme. Recomiendo a Francisca con los ojos cerrados.",
    estrellas: 5,
  },
];

export const FAQS = [
  {
    p: "¿Qué debo llevar a mi primera consulta?",
    r: "Tu carnet de identidad, carnet de control prenatal si ya lo tienes, exámenes previos y la lista de medicamentos que estés tomando. Si vienes por control ginecológico, evita la consulta durante tu menstruación.",
  },
  {
    p: "¿La atención es particular? ¿Cómo puedo pagar?",
    r: "Sí, la atención es particular. Puedes reservar y pagar online al momento de agendar con Webpay, tarjeta de crédito o débito, o pagar directamente en la consulta el día de tu cita. Los valores de cada servicio están publicados en esta página.",
  },
  {
    p: "¿Desde qué semana de embarazo puedo empezar los controles?",
    r: "Puedes venir desde que tienes el test positivo. Lo ideal es iniciar el control prenatal antes de las 12 semanas para solicitar los primeros exámenes a tiempo.",
  },
  {
    p: "¿Puedo venir acompañada?",
    r: "Por supuesto. Tu pareja, madre, amiga o quien tú elijas es siempre bienvenida. En las sesiones de preparación para el parto, la participación del acompañante es muy recomendable.",
  },
  {
    p: "¿Puedo llevar a mi bebé a la consulta?",
    r: "Por supuesto. En los controles postparto y en las sesiones de lactancia es lo esperable: necesito ver a tu bebé para evaluar el acople y su peso. La consulta está preparada para recibirlos a los dos.",
  },
  {
    p: "¿Qué pasa si necesito cancelar o cambiar mi hora?",
    r: "Puedes cancelar o reagendar desde el correo de confirmación que recibes, hasta 24 horas antes de la cita, sin costo. Si cancelas con menos de 24 horas, se cobra el 50% del valor.",
  },
  {
    p: "¿Puedes recetar medicamentos?",
    r: "Como matrona estoy facultada para recetar anticonceptivos, ácido fólico, vitaminas y algunos tratamientos del área. Para otros casos te derivo oportunamente al médico correspondiente.",
  },
  {
    p: "¿La consulta online sirve igual que la presencial?",
    r: "Para consejerías, resolución de dudas, interpretación de exámenes y seguimiento de lactancia funciona muy bien. Para controles que requieren examen físico (PAP, altura uterina, inserción de DIU) necesitamos vernos presencialmente.",
  },
];

/** Formatea un monto en pesos chilenos. */
export function precioCLP(monto: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(monto);
}
