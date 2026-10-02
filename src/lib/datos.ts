/**
 * Datos del sitio — fuente única de verdad.
 * Editar aquí precios, servicios, horarios y textos.
 */

/** URL pública del sitio. */
export const SITIO_URL = "https://saludfemme.cl";

/**
 * Base para los enlaces que viajan por correo.
 *
 * No basta con `process.env.X ?? SITIO_URL`: `??` solo cae al respaldo
 * cuando el valor es null o undefined, así que una variable vacía o a
 * medio escribir —"http://" -- se colaba y generaba "http:///cita/…".
 * Un enlace roto en el correo no se puede corregir después de enviarlo,
 * así que aquí se valida antes de usarlo.
 */
export function baseDelSitio(): string {
  const v = process.env.NEXT_PUBLIC_SITIO_URL?.trim().replace(/\/+$/, "");
  if (!v) return SITIO_URL;
  try {
    const u = new URL(v);
    // "http://" es una URL válida para el parser, pero sin dominio.
    if (!u.hostname) return SITIO_URL;
    return u.origin;
  } catch {
    // No parsea: puede venir sin protocolo ("saludfemme.cl").
    return /^[\w.-]+\.[a-z]{2,}$/i.test(v) ? `https://${v}` : SITIO_URL;
  }
}

export const CONTACTO = {
  marca: "Salud Femme",
  nombre: "Francisca Carrillo",
  profesion: "Matrona",
  registro: "Reg. Superintendencia de Salud N° 632549",
  telefono: "+56988213371",
  telefonoDisplay: "+56 9 8821 3371",
  email: "contacto.saludfemme@gmail.com",
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
      "https://maps.google.com/?q=Edificio+Espacio+Talca&cid=5844557774143970886",
    coordenadas: { lat: -35.428327, lng: -71.666021 },
  },
  {
    id: "linares",
    ciudad: "Linares",
    centro: "Fix Salud",
    direccion: "Av. León Bustos esquina Mariano Latorre #24",
    referencia: "A pasos de Espacio Urbano",
    // Enlace al lugar exacto en Google Maps, no a una búsqueda por texto.
    mapaUrl:
      "https://maps.google.com/?q=Mariano+Latorre+24,+Linares,+Maule&cid=12720233520895686011",
    coordenadas: { lat: -35.8442818, lng: -71.6053829 },
  },
];

/**
 * Modalidades de atención. Cada una incluye el valor de la consulta y el
 * del control, que es la atención de seguimiento dentro de los 60 días.
 */
export const MODALIDADES_ATENCION = [
  {
    id: "presencial",
    icono: "🏥",
    nombre: "Presencial",
    duracion: 60,
    precio: 30000,
    control: { precio: 25000, duracion: 20 },
    descripcion: "En Talca o Linares, en un espacio confidencial y cómodo.",
  },
  {
    id: "online",
    icono: "💻",
    nombre: "Telemedicina",
    duracion: 45,
    precio: 25000,
    control: { precio: 20000, duracion: 20 },
    descripcion: "Por videollamada, a todo Chile.",
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
  /** Nota destacada en verde: un beneficio, un requisito o una credencial. */
  incluye?: string;
  /** false cuando la nota no es un beneficio incluido en el valor. */
  etiquetaIncluye?: boolean;
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
    aviso:
      "No realizo ecografías, pero entrego la orden en la consulta. No incluye el procesamiento de exámenes por el laboratorio.",
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
    incluye:
      "Si te realizas todos los controles de tu embarazo conmigo, incluye un taller prenatal de lactancia materna online, gratuito. Valor referencial: $40.000.",
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
    incluye: "Puedes venir acompañada de tu pareja.",
    etiquetaIncluye: false,
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
    precio: 25000,
    precioOnline: 20000,
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
    precio: 25000,
    modalidades: ["presencial", "online"],
    aviso: "Obligatoria antes de agendar una inserción.",
  },
  {
    id: "insercion-implante",
    nombre: "Inserción de implante anticonceptivo",
    icono: "💉",
    categoria: "Procedimientos",
    descripcion: "Implanon o Jadelle, en consulta y con anestesia local.",
    precio: 55000,
    modalidades: ["presencial"],
    aviso: "No incluye el implante. Requiere consejería previa.",
  },
  {
    id: "extraccion-implante",
    nombre: "Extracción de implante anticonceptivo",
    icono: "💉",
    categoria: "Procedimientos",
    descripcion: "Retiro de Implanon o Jadelle.",
    precio: 55000,
    modalidades: ["presencial"],
  },
  {
    id: "insercion-diu",
    nombre: "Inserción de dispositivo intrauterino",
    icono: "📌",
    categoria: "Procedimientos",
    descripcion: "T de cobre, Asertia o Mirena.",
    precio: 60000,
    modalidades: ["presencial"],
    aviso: "No incluye el dispositivo. Requiere consejería previa.",
    incluye: "El procedimiento se realiza con anestesia local.",
    etiquetaIncluye: false,
  },
  {
    id: "extraccion-diu",
    nombre: "Extracción de dispositivo intrauterino",
    icono: "📌",
    categoria: "Procedimientos",
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
    precio: 25000,
    precioOnline: 20000,
    modalidades: ["presencial", "online"],
  },
  {
    id: "inyeccion-anticonceptiva",
    nombre: "Administración de inyección anticonceptiva",
    icono: "💉",
    categoria: "Procedimientos",
    descripcion: "Intramuscular o subcutánea.",
    precio: 25000,
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
    incluye:
      "Consejera certificada en VIH e ITS por la Seremi de Salud del Maule.",
    etiquetaIncluye: false,
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
      "Eliminación de verrugas genitales, acrocordones y molusco contagioso. Rápido, con resultados inmediatos y bajo anestesia local.",
    precio: 35000,
    precioNota: "Desde $35.000 · varía según la cantidad de lesiones",
    modalidades: ["presencial"],
  },
];

/**
 * Exámenes que Francisca toma en consulta, en ambas sedes.
 *
 * No son servicios agendables por separado: la toma va dentro de la
 * atención y no suma valor. Lo que sí se paga —y por eso no llevan
 * precio aquí— es el análisis, que cobra el laboratorio.
 */
export const EXAMENES = [
  "Papanicolau",
  "Tipificación de VPH",
  "Panel de ITS",
  "Cultivo de flujo vaginal",
  "SGB en embarazada",
];

/**
 * Talleres y charlas para instituciones.
 *
 * No entran en SERVICIOS porque no se agendan ni tienen valor fijo: se
 * cotizan según el grupo y el contenido. El canal es el correo, no la
 * reserva en línea.
 */
export const TALLERES = {
  destinatarios: "colegios, instituciones, empresas y organizaciones",
  temas: [
    "Salud sexual",
    "Salud femenina",
    "Prevención",
    "Anticoncepción",
    "Embarazo",
    "Lactancia",
  ],
};

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
  "Transferencia bancaria",
  "Efectivo en consulta",
];

/**
 * Datos para la transferencia.
 *
 * Se envían por correo recién cuando Francisca acepta la hora, no antes: así
 * nadie transfiere por un cupo que no estaba disponible.
 *
 * PENDIENTE: reemplazar por los datos reales antes de publicar.
 */
export const DATOS_TRANSFERENCIA = {
  titular: CONTACTO.nombre,
  rut: "—",
  banco: "—",
  tipoCuenta: "—",
  numeroCuenta: "—",
  email: CONTACTO.email,
  /** Horas para pagar antes de que la hora se libere. */
  plazoHoras: 24,
};

/**
 * ¿Están cargados los datos bancarios reales?
 *
 * Mientras no lo estén, el correo de pago pide coordinar por WhatsApp en vez
 * de mostrar una cuenta con guiones.
 */
export function hayDatosTransferencia(): boolean {
  const t = DATOS_TRANSFERENCIA;
  return [t.rut, t.banco, t.tipoCuenta, t.numeroCuenta].every(
    (v) => v && v !== "—"
  );
}

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
  /** Sin uso en la tarjeta: se muestra solo el testimonio. */
  contexto?: string;
  /** Sin uso en la tarjeta. */
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
    p: "¿Atiendes por Fonasa o Isapre?",
    r: "La atención es particular: no cuento con convenio Fonasa. Emito boleta por cada atención para que puedas presentarla a tu Isapre, pero el reembolso no es automático ni estándar: depende del convenio y de la cobertura que tenga tu plan para consultas de matronería. Algunos planes reembolsan una parte, otros no cubren esta prestación. Consúltalo con tu Isapre antes de tu hora, así sabes con qué contar.",
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
    p: "¿Qué exámenes puedes tomarme en la consulta?",
    r: "En Talca y Linares tomo Papanicolau, tipificación de VPH, panel de ITS, cultivo de flujo vaginal y SGB en embarazada. La toma no tiene costo adicional dentro de la consulta, pero el análisis lo cobra el laboratorio. Escríbeme por WhatsApp para conocer el valor y la disponibilidad.",
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
  // El servicio manda cuando declara su propia duración (p. ej. el control
  // díada, de 90 minutos).
  if (servicio.duracion) return servicio.duracion;
  // Si no, vale la de la modalidad: la telemedicina dura menos que la
  // atención presencial.
  const m = MODALIDADES_ATENCION.find((x) => x.id === modalidad);
  return m?.duracion ?? 60;
}

/** Valor mínimo de una atención presencial en Linares. */
export const MINIMO_LINARES = 30000;

/**
 * Valor de una atención según modalidad y sede.
 *
 * En Linares ninguna atención presencial baja de $30.000: las que valen
 * menos se cobran a ese mínimo. La telemedicina no depende de la sede.
 */
export function precioDe(
  servicio: Servicio,
  modalidad: string,
  sede?: string | null
): number {
  if (modalidad === "online") {
    return servicio.precioOnline ?? servicio.precio;
  }
  if (sede === "linares") {
    return Math.max(servicio.precio, MINIMO_LINARES);
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
