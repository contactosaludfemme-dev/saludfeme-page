/**
 * Datos del sitio — fuente única de verdad.
 * Editar aquí precios, servicios, horarios y textos.
 */

/** URL pública del sitio. DEMO: cambiar por el dominio real al publicar. */
export const SITIO_URL = "https://saludfemme.cl";

export const CONTACTO = {
  marca: "Salud Femme",
  nombre: "Francisca Carrillo",
  profesion: "Matrona",
  registro: "Reg. Superintendencia de Salud N° 632549",
  telefono: "+56988213371",
  telefonoDisplay: "+56 9 8821 3371",
  email: "contacto@saludfemme.cl", // PENDIENTE: confirmar correo real
  instagram: "saludfemme.matrona",
  lema: "Tu salud, tu espacio, tus decisiones.",
} as const;

export type Sede = {
  id: string;
  ciudad: string;
  centro: string;
  direccion: string;
  mapaUrl: string;
  coordenadas: { lat: number; lng: number };
  referencia?: string;
};

export const SEDES: Sede[] = [
  {
    id: "talca",
    ciudad: "Talca",
    centro: "Centro Kuyentun",
    direccion: "Edificio Espacio Talca, 2 Sur con 2 Oriente, piso 13, of. 1315",
    mapaUrl:
      "https://maps.google.com/?q=Edificio+Espacio+Talca+2+Sur+2+Oriente+Talca",
    coordenadas: { lat: -35.4269, lng: -71.6554 },
  },
  {
    id: "linares",
    ciudad: "Linares",
    centro: "Fix Salud",
    direccion: "Av. León Bustos esquina Mariano Latorre #24",
    referencia: "A pasos de Espacio Urbano",
    mapaUrl:
      "https://maps.google.com/?q=Mariano+Latorre+24+Linares+Chile",
    coordenadas: { lat: -35.8464, lng: -71.5931 },
  },
];

/** Modalidades con su duración y valor base. */
export const MODALIDADES_ATENCION = [
  {
    id: "presencial",
    icono: "🏥",
    nombre: "Presencial",
    duracion: 60,
    precio: 30000,
    descripcion: "En Talca o Linares, en un espacio confidencial y cómodo.",
  },
  {
    id: "online",
    icono: "💻",
    nombre: "Telemedicina",
    duracion: 45,
    precio: 25000,
    descripcion: "Por videollamada, a todo Chile.",
  },
  {
    id: "control",
    icono: "🔁",
    nombre: "Control",
    duracion: 20,
    precio: 20000,
    descripcion:
      "Presencial u online, hasta 60 días después de tu primera atención.",
  },
] as const;

/** Cifras de trayectoria mostradas en el hero. */
export const TRAYECTORIA_CIFRAS = [
  { num: "+6", lbl: "años de experiencia" },
  { num: "+1.000", lbl: "atenciones realizadas" },
  { num: "+200", lbl: "testimonios recibidos" },
];

/** Áreas de atención, para el resumen rápido. */
export const AREAS = [
  { icono: "🌸", nombre: "Salud ginecológica" },
  { icono: "💗", nombre: "Salud sexual y sexología" },
  { icono: "🌷", nombre: "Anticoncepción" },
  { icono: "🤰", nombre: "Control prenatal" },
  { icono: "🌺", nombre: "Climaterio y menopausia" },
  { icono: "✨", nombre: "Procedimientos y Plasmapen" },
];

export const CATEGORIAS = [
  "Consultas y controles",
  "Anticoncepción",
  "Salud sexual",
  "Procedimientos",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export type Servicio = {
  id: string;
  nombre: string;
  icono: string;
  categoria: Categoria;
  descripcion: string;
  precio: number;
  /** Valor distinto según modalidad, cuando aplica. */
  precioOnline?: number;
  /** Texto libre cuando el valor no es fijo. */
  precioNota?: string;
  duracion?: number;
  modalidades: ("presencial" | "online")[];
  /** Advertencia o requisito que la paciente debe conocer antes de agendar. */
  aviso?: string;
};

export const SERVICIOS: Servicio[] = [
  // ---------- Consultas y controles ----------
  {
    id: "control-ginecologico",
    nombre: "Control ginecológico",
    icono: "🌸",
    categoria: "Consultas y controles",
    descripcion:
      "Evaluación de tu salud ginecológica, con orientación e indicación de exámenes cuando corresponda.",
    precio: 30000,
    modalidades: ["presencial", "online"],
    aviso: "No incluye el procesamiento de exámenes por el laboratorio.",
  },
  {
    id: "control-embarazo",
    nombre: "Control de embarazo",
    icono: "🤰",
    categoria: "Consultas y controles",
    descripcion:
      "Seguimiento de tu embarazo con acompañamiento cercano en cada etapa.",
    precio: 30000,
    modalidades: ["presencial", "online"],
    aviso: "No realizo ecografías, pero entrego la orden en la consulta.",
  },
  {
    id: "control-preconcepcional",
    nombre: "Control preconcepcional",
    icono: "🌱",
    categoria: "Consultas y controles",
    descripcion:
      "Preparación de tu salud antes de buscar un embarazo: exámenes, suplementación y resolución de dudas.",
    precio: 30000,
    modalidades: ["presencial", "online"],
  },
  {
    id: "control-diada",
    nombre: "Control díada",
    icono: "🤱",
    categoria: "Consultas y controles",
    descripcion:
      "Evaluación conjunta de madre, recién nacido y lactancia materna, con tiempo suficiente para revisarlo todo.",
    precio: 45000,
    duracion: 90,
    modalidades: ["presencial"],
  },
  {
    id: "climaterio",
    nombre: "Salud en climaterio y menopausia",
    icono: "🌺",
    categoria: "Consultas y controles",
    descripcion:
      "Acompañamiento en esta etapa: manejo de síntomas, salud ósea y bienestar general.",
    precio: 30000,
    modalidades: ["presencial", "online"],
  },
  {
    id: "ciclo-menstrual",
    nombre: "Educación en ciclo menstrual",
    icono: "🌙",
    categoria: "Consultas y controles",
    descripcion:
      "Entender tu ciclo, reconocer sus fases y saber qué es normal y qué no.",
    precio: 30000,
    modalidades: ["presencial", "online"],
  },
  {
    id: "evaluacion-examenes",
    nombre: "Evaluación de resultados de exámenes",
    icono: "📋",
    categoria: "Consultas y controles",
    descripcion:
      "Revisión de tus resultados con indicaciones, educación y derivación cuando corresponda.",
    precio: 20000,
    modalidades: ["presencial", "online"],
    aviso:
      "La revisión es gratuita dentro de los 7 días corridos desde que se entregó la orden.",
  },

  // ---------- Anticoncepción ----------
  {
    id: "consejeria-anticonceptivos",
    nombre: "Consejería en anticonceptivos",
    icono: "🌷",
    categoria: "Anticoncepción",
    descripcion:
      "Elegimos juntas el método que mejor se adapta a tu cuerpo, tu etapa y tu proyecto de vida.",
    precio: 30000,
    modalidades: ["presencial", "online"],
  },
  {
    id: "consejeria-implante-diu",
    nombre: "Consejería de implante o DIU",
    icono: "📌",
    categoria: "Anticoncepción",
    descripcion:
      "Coordinamos la fecha, los exámenes necesarios y la compra del anticonceptivo antes de la inserción.",
    precio: 20000,
    modalidades: ["presencial", "online"],
    aviso: "Obligatoria antes de agendar una inserción.",
  },
  {
    id: "insercion-implante",
    nombre: "Inserción de implante anticonceptivo",
    icono: "💉",
    categoria: "Anticoncepción",
    descripcion: "Implanon o Jadelle, en consulta y con anestesia local.",
    precio: 55000,
    modalidades: ["presencial"],
    aviso: "No incluye el implante. Requiere consejería previa.",
  },
  {
    id: "extraccion-implante",
    nombre: "Extracción de implante anticonceptivo",
    icono: "💉",
    categoria: "Anticoncepción",
    descripcion: "Retiro de Implanon o Jadelle.",
    precio: 55000,
    modalidades: ["presencial"],
  },
  {
    id: "insercion-diu",
    nombre: "Inserción de dispositivo intrauterino",
    icono: "📌",
    categoria: "Anticoncepción",
    descripcion: "T de cobre, Asertia o Mirena.",
    precio: 60000,
    modalidades: ["presencial"],
    aviso: "No incluye el dispositivo. Requiere consejería previa.",
  },
  {
    id: "extraccion-diu",
    nombre: "Extracción de dispositivo intrauterino",
    icono: "📌",
    categoria: "Anticoncepción",
    descripcion: "T de cobre, Asertia, Mirena o Kyleena.",
    precio: 35000,
    modalidades: ["presencial"],
  },
  {
    id: "control-anticonceptivos",
    nombre: "Control de anticonceptivos",
    icono: "🔁",
    categoria: "Anticoncepción",
    descripcion:
      "Seguimiento posterior a la indicación: implantes, DIU, píldoras, anillo, inyecciones o parche.",
    precio: 20000,
    modalidades: ["presencial", "online"],
  },
  {
    id: "inyeccion-anticonceptiva",
    nombre: "Administración de inyección anticonceptiva",
    icono: "💉",
    categoria: "Anticoncepción",
    descripcion: "Intramuscular o subcutánea.",
    precio: 20000,
    modalidades: ["presencial"],
  },

  // ---------- Salud sexual ----------
  {
    id: "consejeria-sexologia",
    nombre: "Consejería individual en sexología",
    icono: "💗",
    categoria: "Salud sexual",
    descripcion:
      "Un espacio para conversar sobre tu sexualidad sin prejuicios, desde una mirada profesional e integral.",
    precio: 40000,
    modalidades: ["presencial", "online"],
  },
  {
    id: "infecciones",
    nombre: "Consejería en infecciones vulvovaginales e ITS",
    icono: "🔬",
    categoria: "Salud sexual",
    descripcion:
      "Evaluación de síntomas, indicación de tratamiento y orientación sobre prevención.",
    precio: 30000,
    modalidades: ["presencial", "online"],
  },
  {
    id: "lactancia",
    nombre: "Consejería en lactancia materna",
    icono: "🤱",
    categoria: "Salud sexual",
    descripcion:
      "Revisión de técnica y acople, manejo del dolor y acompañamiento en el proceso.",
    precio: 40000,
    precioOnline: 30000,
    modalidades: ["presencial", "online"],
  },

  // ---------- Procedimientos ----------
  {
    id: "plasmapen",
    nombre: "Plasmapen",
    icono: "✨",
    categoria: "Procedimientos",
    descripcion:
      "Eliminación de verrugas genitales. Rápido, con resultados inmediatos y bajo anestesia local.",
    precio: 35000,
    precioNota: "Desde $35.000 · varía según la cantidad de lesiones",
    modalidades: ["presencial"],
  },
];

/** Notas generales que aplican a todos los servicios. */
export const NOTAS_SERVICIOS = [
  "No realizo ecografías, pero entrego la orden para hacerlas en la consulta.",
  "Para inserción de implante o DIU debes agendar primero una consejería, donde coordinamos fecha, exámenes y la compra del anticonceptivo.",
  "La revisión de exámenes es gratuita hasta 7 días corridos desde la entrega de las órdenes. Pasado ese plazo, corresponde agendar un control o consulta.",
  "Se considera control hasta 60 días después de la atención. Pasado ese tiempo, debes agendar como primera consulta.",
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

/**
 * Testimonios reales de pacientes, recopilados por Francisca.
 *
 * Se publican sin nombre: varios mencionan diagnósticos concretos y
 * vincularlos a una persona identificable expondría datos de salud.
 * `contexto` describe el motivo de consulta solo cuando no permite
 * identificar a nadie.
 */
export type Testimonio = {
  texto: string;
  contexto?: string;
  ciudad?: string;
};

export const TESTIMONIOS: Testimonio[] = [
  {
    texto:
      "Me dejé estar tres años sin chequeos, normalizando síntomas. Cuando llegué donde Francisca, indagó con mucho respeto y me motivó a llevar mis exámenes al día. Gracias a eso llegamos a un diagnóstico y me dio opciones de tratamiento. En pocos días sentí que volví a ser yo. Hasta mis hijos me dicen que me ven más feliz y descansada.",
    contexto: "Diagnóstico y tratamiento",
  },
  {
    texto:
      "Nunca me habían tratado así en consulta. Había tenido muy malas experiencias antes. Es muy cercana, te explica todo con paciencia y los procedimientos los hace con mucho tacto: te va explicando lo que va a pasar, pide permiso, pregunta si algo duele y para si es necesario. Siento como si me estuviera atendiendo una amiga.",
    contexto: "Control ginecológico",
  },
  {
    texto:
      "Me explicó todo de forma muy clara y sencilla, incluso con dibujos, y llevó distintos métodos anticonceptivos para mostrarme cómo funcionaba cada uno. Pudimos elegir juntas el que mejor se adaptaba a mi estilo de vida. He podido preguntar cualquier inquietud sin sentir vergüenza.",
    contexto: "Consejería en anticonceptivos",
    ciudad: "Linares",
  },
  {
    texto:
      "No negaré que tenía mucho miedo. Pero desde que uno entra a su consulta, su saludo ya te hace sentir comodidad y tranquilidad. Se da el tiempo de escuchar con mucho respeto y aclara todas las dudas. Su paciencia es admirable. Se preocupa de que uno se vaya sin dudas.",
    contexto: "Primera consulta",
  },
  {
    texto:
      "Desde el primer día me hizo sentir en un espacio seguro y muy acogedor. Siempre está atenta a cada duda, tanto en la consulta como después por mensaje, porque siempre se nos queda algo por preguntar. Es súper puntual y busca la forma de acomodar horarios.",
  },
  {
    texto:
      "Busqué muchos doctores y nunca encontraron una solución. Al llegar a ella fue el término del problema: me confirmó que sí encontraríamos salida y me apoyó siempre en mi frustración. Llevo años atendiéndome con ella, tanto que vi todo mi embarazo a su lado.",
    contexto: "Infecciones recurrentes y embarazo",
  },
  {
    texto:
      "En cada consulta demuestra profesionalismo, dedicación y una gran calidad humana. Se toma el tiempo de responder todas mis dudas con claridad y paciencia. Cada atención tiene un ambiente de respeto y contención, lo que genera un espacio verdaderamente seguro.",
  },
  {
    texto:
      "Llegué a través de una publicación en Instagram y desde el primer momento ha sido una experiencia excelente. Se toma el tiempo de escuchar, explicar cada proceso con claridad y resolver todas mis dudas. Siempre me entrega información actualizada y recomendaciones basadas en evidencia.",
  },
  {
    texto:
      "Antes de consultar me sentía insegura y con varias dudas, pero desde el primer momento me hizo sentir escuchada, contenida y en total confianza. Su forma tan amorosa y respetuosa de atender marca una diferencia enorme. Se nota su vocación y el cariño con el que hace su trabajo.",
  },
  {
    texto:
      "Llevo alrededor de tres años atendiéndome con Francisca. Te hace sentir en un espacio completamente seguro, donde puedes expresar todas tus dudas y en ningún momento te hace sentir mal por no saber. Ha sido el lugar más cómodo y de confianza durante estos años.",
  },
  {
    texto:
      "Antes había tenido malas experiencias, así que llegué con cierta inseguridad. Pero me encontré con una atención cercana, respetuosa y muy profesional. Me sentí realmente escuchada y acompañada. Agradezco poder contar con una atención tan humana y de calidad acá.",
    ciudad: "Linares",
  },
  {
    texto:
      "Hacía mucho tiempo no iba a una matrona, y de hecho nunca me había hecho el examen del PAP. Resolvió todas mis dudas con paciencia y profesionalismo. No me sentí cuestionada ni incómoda, lo cual valoro mucho.",
    contexto: "Control ginecológico y PAP",
  },
  {
    texto:
      "Ha sido de las mejores atenciones que he tenido. Llegué a ella por Instagram y me encanta la atención: se da el tiempo de responder dudas, explica de forma clara y que uno pueda entender. Siempre está dispuesta y disponible.",
  },
  {
    texto:
      "Una profesional muy preocupada de su paciente, que responde cada pregunta y duda que tengas en mente, siempre atenta a que esté todo bien. La recomiendo, es muy dedicada en su especialidad.",
  },
  {
    texto:
      "Es una excelente profesional: cercana, humana, que conecta con sus pacientes. Muy respetuosa, preocupada y delicada, que es fundamental en su trabajo. Llevaba tiempo buscando una atención como la de ella y estoy feliz.",
  },
  {
    texto:
      "Siempre he tenido malas experiencias con algunas matronas, pero Fran es totalmente diferente. Muy cariñosa y amable; uno realmente se siente en confianza y tranquila, porque responde todas las dudas de una forma muy amable.",
  },
  {
    texto:
      "Acudí por recomendación de una amiga y la verdad es que es muy buena profesional. Te hace sentir muy cómoda y segura en todo momento. Es muy buena en lo que hace y se nota que tiene mucha vocación.",
  },
  {
    texto:
      "Es una profesional muy cercana, explica todo claramente y resuelve con paciencia todas las dudas. Totalmente recomendada.",
  },
  {
    texto:
      "Han sido unas atenciones muy gratas, me he sentido súper cómoda y en confianza. Gracias por todo.",
  },
  {
    texto:
      "Muy clara en las explicaciones, mucha empatía con las dudas que nos complican.",
  },
];

export const FAQS = [
  {
    p: "¿Cómo puedo agendar?",
    r: "Puedes pre-agendar tu consulta directamente en esta página. Luego finalizamos el agendamiento por correo o WhatsApp con el comprobante de pago.",
  },
  {
    p: "¿Cómo se paga?",
    r: "Por transferencia electrónica. Tu hora queda confirmada una vez que recibo el comprobante del pago anticipado.",
  },
  {
    p: "¿Atiendes presencialmente?",
    r: "Sí, en Talca (Centro Kuyentun, Edificio Espacio Talca) y en Linares (Fix Salud, Av. León Bustos esquina Mariano Latorre #24).",
  },
  {
    p: "¿Realizas consultas online?",
    r: "Sí, a todo Chile. La telemedicina dura 45 minutos y tiene un valor de $25.000.",
  },
  {
    p: "¿Atiendes por Fonasa?",
    r: "No cuento con convenio Fonasa. La atención es solo particular.",
  },
  {
    p: "¿Realizas ecografías en tu consulta?",
    r: "No realizo ecografías, pero sí entrego la orden para que te las hagas.",
  },
  {
    p: "¿Desde qué edad atiendes pacientes?",
    r: "Desde los 10 años, para control adolescente y educación en ciclo menstrual.",
  },
  {
    p: "¿Puedo asistir acompañada a la consulta?",
    r: "Sí, con tu persona significativa o tu pareja, respetando siempre el espacio de tu atención.",
  },
  {
    p: "¿La consulta incluye examen físico?",
    r: "Depende del motivo de consulta y de la prestación solicitada. Nada se realiza sin tu consentimiento explícito.",
  },
  {
    p: "¿Cuánto plazo tengo para agendar como control y no como primera consulta?",
    r: "Tienes 60 días desde tu atención. Pasado ese plazo, corresponde agendar como primera consulta.",
  },
  {
    p: "¿Revisas los exámenes solicitados de manera gratuita?",
    r: "Sí, dentro de un plazo de 7 días corridos desde que se entregó la orden. Pasado ese tiempo, debes agendar un control o consulta según corresponda.",
  },
  {
    p: "¿Qué pasa si necesito cancelar o cambiar mi hora?",
    r: "Puedes reprogramar o cancelar hasta 24 horas antes. Con menos de 24 horas de aviso se retiene el 50% del valor, porque ese horario ya no puede reasignarse a otra paciente.",
  },
  {
    p: "¿Qué debo llevar a mi primera consulta?",
    r: "Tu carnet de identidad, exámenes previos si los tienes y la lista de medicamentos que estés tomando.",
  },
  {
    p: "¿Necesito consejería antes de ponerme un implante o DIU?",
    r: "Sí, es obligatoria. En ella coordinamos la fecha del procedimiento, los exámenes si son necesarios y la compra previa del anticonceptivo.",
  },
];

/**
 * Duración real de una atención.
 * La define la modalidad (60 min presencial, 45 online), salvo que el
 * servicio declare la suya — como el control díada, de 90 minutos.
 */
export function duracionDe(servicio: Servicio, modalidad: string): number {
  if (servicio.duracion) return servicio.duracion;
  return modalidad === "online" ? 45 : 60;
}

/** Valor de una atención según la modalidad elegida. */
export function precioDe(servicio: Servicio, modalidad: string): number {
  if (modalidad === "online" && servicio.precioOnline) {
    return servicio.precioOnline;
  }
  return servicio.precio;
}

/** Formatea un monto en pesos chilenos. */
export function precioCLP(monto: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(monto);
}
