import type { Metadata, Viewport } from "next";
import { Poppins, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { CONTACTO, SITIO_URL as SITIO } from "@/lib/datos";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: {
    default: `${CONTACTO.nombre} — Matrona en ${CONTACTO.comuna.split(",")[0]}`,
    template: `%s | Matrona ${CONTACTO.nombre}`,
  },
  description:
    "Matrona en Talca. Control prenatal, control ginecológico y PAP, consejería en anticoncepción, preparación para el parto y asesoría en lactancia. Agenda tu hora online.",
  keywords: [
    "matrona Talca",
    "matrona Región del Maule",
    "control prenatal",
    "PAP Talca",
    "asesoría lactancia",
    "preparación para el parto",
    "consejería anticoncepción",
  ],
  authors: [{ name: CONTACTO.nombre }],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITIO,
    siteName: `Matrona ${CONTACTO.nombre}`,
    title: `${CONTACTO.nombre} — Matrona en ${CONTACTO.comuna.split(",")[0]}`,
    description:
      "Acompañamiento integral en salud sexual y reproductiva. Agenda tu hora online en menos de un minuto.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITIO },
};

export const viewport: Viewport = {
  themeColor: "#E5308F",
  width: "device-width",
  initialScale: 1,
};

/** Datos estructurados para SEO local (Google Business / rich results). */
function DatosEstructurados() {
  const json = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: `Matrona ${CONTACTO.nombre}`,
    description:
      "Atención de matronería: control prenatal, control ginecológico, anticoncepción, preparación para el parto y lactancia.",
    url: SITIO,
    telephone: CONTACTO.telefono,
    email: CONTACTO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACTO.direccion,
      addressLocality: "Talca",
      addressRegion: "Región del Maule",
      addressCountry: "CL",
    },
    medicalSpecialty: "Obstetric",
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "09:00",
        closes: "15:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "14:00",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL" className={`${poppins.variable} ${inter.variable} ${caveat.variable}`}>
      <body>
        {/* Enlace de salto: oculto hasta recibir foco.
            Se posiciona dentro del viewport — con el `margin:-1px` de
            `sr-only` sobresalía por la izquierda y desplazaba la página. */}
        <a
          href="#contenido"
          className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-magenta-500 px-5 py-2 text-white opacity-0 transition-transform focus:translate-y-0 focus:opacity-100"
        >
          Saltar al contenido principal
        </a>
        {children}
        <DatosEstructurados />
      </body>
    </html>
  );
}
