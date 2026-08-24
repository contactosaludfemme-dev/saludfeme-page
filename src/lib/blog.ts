/**
 * Artículos del blog.
 *
 * DEMO: cuatro artículos de ejemplo, escritos a partir del tipo de contenido
 * que ella ya publica en Instagram. Reemplazar por los suyos.
 *
 * Para agregar uno nuevo: copiar un objeto, cambiar `slug` (va en la URL),
 * y escribir el cuerpo en `contenido`. El formato admite:
 *   { tipo: "parrafo",  texto: "..." }
 *   { tipo: "subtitulo", texto: "..." }
 *   { tipo: "lista",    items: ["...", "..."] }
 *   { tipo: "destacado", texto: "..." }   → caja rosada con borde
 *   { tipo: "alerta",   texto: "..." }    → aviso de consultar/urgencia
 */

export type Bloque =
  | { tipo: "parrafo"; texto: string }
  | { tipo: "subtitulo"; texto: string }
  | { tipo: "lista"; items: string[] }
  | { tipo: "destacado"; texto: string }
  | { tipo: "alerta"; texto: string };

export type Articulo = {
  slug: string;
  titulo: string;
  bajada: string;
  tema: Tema;
  icono: string;
  /**
   * Arte del post, en formato vertical 4:5 (el de sus carruseles de
   * Instagram). Ruta dentro de /public, ej. "/blog/lactancia.jpg".
   * Si no hay imagen, se muestra un marcador con el ícono del tema.
   */
  imagen?: string;
  fecha: string;        // ISO, para ordenar y para el SEO
  minutosLectura: number;
  contenido: Bloque[];
  /** Servicio relacionado, para invitar a agendar al final. */
  servicioRelacionado?: string;
};

export const TEMAS = [
  "Embarazo",
  "Parto",
  "Lactancia",
  "Anticoncepción",
  "Salud ginecológica",
] as const;

export type Tema = (typeof TEMAS)[number];

export const ARTICULOS: Articulo[] = [
  {
    slug: "cuando-empezar-control-prenatal",
    titulo: "¿Desde qué semana debo empezar mi control prenatal?",
    bajada:
      "Cuándo pedir tu primera hora, qué exámenes se piden al inicio y por qué llegar temprano importa más de lo que parece.",
    tema: "Embarazo",
    icono: "🤰",
    imagen: "/blog/control-prenatal.svg",
    fecha: "2026-08-04",
    minutosLectura: 4,
    servicioRelacionado: "control-prenatal",
    contenido: [
      {
        tipo: "parrafo",
        texto:
          "Es una de las preguntas que más recibo, y la respuesta corta es: apenas tengas un test positivo. No necesitas esperar a sentir síntomas ni a que pasen las primeras semanas.",
      },
      {
        tipo: "destacado",
        texto:
          "Lo ideal es iniciar el control antes de las 12 semanas. Si ya pasaste ese plazo, igual ven: nunca es tarde para empezar.",
      },
      { tipo: "subtitulo", texto: "Por qué conviene llegar temprano" },
      {
        tipo: "parrafo",
        texto:
          "Las primeras doce semanas concentran decisiones que después no se pueden tomar. Hay exámenes que solo tienen valor si se hacen dentro de cierta ventana, y suplementos que protegen justo en ese período.",
      },
      {
        tipo: "lista",
        items: [
          "El ácido fólico previene defectos del tubo neural, y actúa en las primeras semanas de gestación.",
          "La ecografía entre las 11 y 14 semanas es la que mejor determina tu fecha probable de parto.",
          "Los exámenes de sangre iniciales detectan anemia, infecciones y tu grupo sanguíneo a tiempo.",
          "Si tienes alguna condición previa —diabetes, hipertensión, tiroides— hay que ajustar tratamientos cuanto antes.",
        ],
      },
      { tipo: "subtitulo", texto: "Qué pasa en tu primera consulta" },
      {
        tipo: "parrafo",
        texto:
          "La primera vez conversamos harto. Reviso tus antecedentes de salud, embarazos previos si los hubo, tu ciclo, medicamentos que tomes y cómo te has sentido. Con la fecha de tu última menstruación calculamos las semanas y tu fecha probable de parto.",
      },
      {
        tipo: "parrafo",
        texto:
          "Después viene el examen físico: peso, presión arterial y, según las semanas, buscamos los latidos de tu bebé. Salimos con las órdenes de tus primeros exámenes y una fecha para el siguiente control.",
      },
      { tipo: "subtitulo", texto: "Qué llevar" },
      {
        tipo: "lista",
        items: [
          "Tu carnet de identidad.",
          "La fecha de tu última menstruación, si la recuerdas.",
          "Exámenes o ecografías previas, si ya te hiciste alguna.",
          "La lista de medicamentos o suplementos que estés tomando.",
        ],
      },
      {
        tipo: "alerta",
        texto:
          "Si tienes sangrado, dolor abdominal intenso o fiebre, no esperes a tu hora agendada: acude al servicio de urgencia más cercano.",
      },
    ],
  },
  {
    slug: "dolor-al-amamantar-primeros-dias",
    titulo: "¿Duele amamantar? Lo que es normal y lo que no",
    bajada:
      "El dolor no es parte de la lactancia. Cómo reconocer un mal acople, qué hacer con las grietas y cuándo pedir ayuda.",
    tema: "Lactancia",
    icono: "🤱",
    imagen: "/blog/lactancia.svg",
    fecha: "2026-07-22",
    minutosLectura: 5,
    servicioRelacionado: "postparto-lactancia",
    contenido: [
      {
        tipo: "parrafo",
        texto:
          "Hay una idea muy instalada de que amamantar duele y hay que aguantar. Quiero partir por ahí, porque es la causa de que muchas mujeres abandonen la lactancia sintiendo que fallaron.",
      },
      {
        tipo: "destacado",
        texto:
          "Una molestia leve los primeros días es esperable. Un dolor que te hace apretar los dientes, que dura toda la mamada o que te deja grietas, no lo es. Es una señal de que algo se puede corregir.",
      },
      { tipo: "subtitulo", texto: "Casi siempre es el acople" },
      {
        tipo: "parrafo",
        texto:
          "La causa más frecuente del dolor es que tu bebé está tomando solo el pezón en vez de abarcar buena parte de la areola. Cuando eso pasa, comprime en el lugar equivocado: duele, y además saca menos leche.",
      },
      { tipo: "subtitulo", texto: "Señales de un buen acople" },
      {
        tipo: "lista",
        items: [
          "Tu bebé abre la boca bien grande antes de tomar el pecho.",
          "Su mentón toca tu pecho y la nariz queda despejada.",
          "Los labios quedan hacia afuera, como de pescadito.",
          "Se ve más areola por sobre el labio superior que por debajo.",
          "Escuchas que traga, con pausas, no solo movimientos rápidos.",
          "No sientes dolor una vez que empezó a mamar.",
        ],
      },
      { tipo: "subtitulo", texto: "Si ya tienes grietas" },
      {
        tipo: "parrafo",
        texto:
          "Lo primero es corregir el acople, porque si no, la grieta no cierra por mucha crema que te pongas. Después de cada mamada puedes dejar una gota de tu propia leche sobre el pezón y secar al aire.",
      },
      {
        tipo: "lista",
        items: [
          "Empieza por el pecho que duela menos: el bebé succiona más fuerte al principio.",
          "Rompe el vacío con tu dedo meñique antes de retirarlo, nunca tirando.",
          "Evita jabones y cremas perfumadas en la zona.",
          "No suspendas la lactancia sin conversarlo antes: hay soluciones intermedias.",
        ],
      },
      {
        tipo: "alerta",
        texto:
          "Consulta pronto si tienes fiebre, una zona del pecho roja y caliente, o dolor intenso que no cede: puede ser una mastitis y necesita tratamiento.",
      },
      {
        tipo: "parrafo",
        texto:
          "Una sesión de asesoría suele bastar para corregir la técnica. He visto muchas veces cómo cambia todo en una sola consulta — y siempre me quedo pensando en cuánto dolor se podría haber evitado si hubieran consultado antes.",
      },
    ],
  },
  {
    slug: "como-elegir-metodo-anticonceptivo",
    titulo: "Cómo elegir tu método anticonceptivo",
    bajada:
      "No existe el mejor método, existe el mejor para ti. Las preguntas que conviene hacerse antes de decidir.",
    tema: "Anticoncepción",
    icono: "💊",
    imagen: "/blog/anticoncepcion.svg",
    fecha: "2026-07-08",
    minutosLectura: 6,
    servicioRelacionado: "anticoncepcion",
    contenido: [
      {
        tipo: "parrafo",
        texto:
          "Cuando alguien me pregunta cuál es el mejor método anticonceptivo, mi respuesta siempre es la misma: depende de ti. De tu salud, tu etapa, tu rutina y de qué tan cómoda te sientas con cada opción.",
      },
      { tipo: "subtitulo", texto: "Cuatro preguntas para orientarte" },
      {
        tipo: "lista",
        items: [
          "¿Buscas algo por unos meses o por varios años?",
          "¿Te acomoda algo diario, o prefieres olvidarte por un tiempo largo?",
          "¿Tienes alguna condición de salud, o fumas y tienes más de 35 años?",
          "¿Necesitas también protección contra infecciones de transmisión sexual?",
        ],
      },
      {
        tipo: "destacado",
        texto:
          "El preservativo es el único método que además previene infecciones de transmisión sexual. Se puede combinar con cualquier otro.",
      },
      { tipo: "subtitulo", texto: "Métodos de larga duración" },
      {
        tipo: "parrafo",
        texto:
          "El DIU (de cobre o con hormona) y el implante subdérmico duran entre 3 y 10 años según el tipo. Son los más efectivos justamente porque no dependen de que te acuerdes de nada. Se instalan en consulta y puedes retirarlos cuando quieras.",
      },
      { tipo: "subtitulo", texto: "Métodos hormonales de uso regular" },
      {
        tipo: "parrafo",
        texto:
          "Las pastillas, el parche, el anillo vaginal y la inyección funcionan muy bien si se usan de forma constante. La diferencia entre ellos está sobre todo en la frecuencia: diaria, semanal, mensual o trimestral.",
      },
      { tipo: "subtitulo", texto: "Sobre los efectos que te preocupan" },
      {
        tipo: "parrafo",
        texto:
          "Los primeros tres meses con un método nuevo suelen traer ajustes: sangrados irregulares, sensibilidad mamaria, cambios de ánimo. Muchas veces eso se acomoda solo. Si no, se cambia — no tienes por qué aguantar un método que te hace sentir mal.",
      },
      {
        tipo: "alerta",
        texto:
          "Ningún método anticonceptivo debería indicarse sin una evaluación previa de tus antecedentes de salud. Si alguien te lo recomienda sin preguntarte nada, busca otra opinión.",
      },
    ],
  },
  {
    slug: "senales-de-alarma-en-el-embarazo",
    titulo: "Señales de alarma en el embarazo que no debes ignorar",
    bajada:
      "Cuándo esperar a tu próximo control, cuándo llamarme y cuándo ir directo a urgencias.",
    tema: "Embarazo",
    icono: "⚠️",
    imagen: "/blog/senales-alarma.svg",
    fecha: "2026-06-17",
    minutosLectura: 4,
    servicioRelacionado: "control-prenatal",
    contenido: [
      {
        tipo: "parrafo",
        texto:
          "El embarazo trae molestias nuevas casi todas las semanas, y es difícil saber qué es normal. Esta guía es para que tengas claro cuándo consultar sin dudarlo.",
      },
      {
        tipo: "alerta",
        texto:
          "Ante cualquiera de estas señales, acude al servicio de urgencia más cercano o llama al 131. No esperes a tu próximo control.",
      },
      { tipo: "subtitulo", texto: "Ve a urgencias si tienes" },
      {
        tipo: "lista",
        items: [
          "Sangrado vaginal, en cualquier cantidad y en cualquier trimestre.",
          "Pérdida de líquido por la vagina, aunque sea poco.",
          "Dolor de cabeza intenso que no cede, visión borrosa o luces en la vista.",
          "Dolor abdominal fuerte y sostenido.",
          "Fiebre sobre 38 °C.",
          "Después de las 28 semanas: notar que tu bebé se mueve mucho menos de lo habitual.",
          "Hinchazón brusca de cara, manos o pies.",
          "Contracciones regulares antes de las 37 semanas.",
        ],
      },
      { tipo: "subtitulo", texto: "Sobre los movimientos de tu bebé" },
      {
        tipo: "parrafo",
        texto:
          "Desde las 28 semanas conviene que conozcas su patrón. No se trata de contar todo el día, sino de notar si un día se mueve claramente menos que de costumbre. Si te pasa: recuéstate de lado, toma algo dulce y presta atención durante dos horas. Si sigues sin sentirlo como siempre, ve a urgencias.",
      },
      { tipo: "subtitulo", texto: "Molestias que sí son esperables" },
      {
        tipo: "lista",
        items: [
          "Náuseas durante el primer trimestre.",
          "Acidez y reflujo, sobre todo al final del embarazo.",
          "Dolor lumbar leve por el cambio de postura.",
          "Contracciones aisladas e irregulares que ceden al descansar.",
          "Hinchazón leve de pies al final del día.",
        ],
      },
      {
        tipo: "destacado",
        texto:
          "Ante la duda, consulta. Prefiero mil veces que me escribas por algo que resultó ser normal, a que te quedes en casa preocupada.",
      },
    ],
  },
];

/** Artículos ordenados del más reciente al más antiguo. */
export function articulosOrdenados(): Articulo[] {
  return [...ARTICULOS].sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function buscarArticulo(slug: string): Articulo | undefined {
  return ARTICULOS.find((a) => a.slug === slug);
}

/** Otros artículos del mismo tema, para sugerir al final. */
export function relacionados(art: Articulo, max = 2): Articulo[] {
  return ARTICULOS.filter((a) => a.slug !== art.slug && a.tema === art.tema).slice(0, max);
}

/** Fecha legible: "4 de agosto de 2026". */
export function fechaLegible(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CL", {
    day: "numeric", month: "long", year: "numeric",
  });
}
