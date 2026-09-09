import type { Metadata, Viewport } from "next";
import { Poppins, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { CONTACTO, SEDES, SITIO_URL as SITIO } from "@/lib/datos";

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
    default: `${CONTACTO.marca} — Matrona en Talca y Linares`,
    template: `%s | ${CONTACTO.marca}`,
  },
  description:
    "Matrona en Talca y Linares. Salud ginecológica, sexología, anticoncepción, control de embarazo, climaterio y procedimientos. Atención online a todo Chile.",
  keywords: [
    "matrona Talca",
    "matrona Linares",
    "sexóloga Talca",
    "inserción DIU Talca",
    "implante anticonceptivo Talca",
    "control prenatal",
    "control ginecológico Talca",
    "asesoría lactancia",
    "preparación para el parto",
    "consejería anticoncepción",
  ],
  authors: [{ name: CONTACTO.nombre }],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITIO,
    siteName: CONTACTO.marca,
    title: `${CONTACTO.marca} — Matrona en Talca y Linares`,
    description:
      "Tu salud, tu espacio, tus decisiones. Atención en Talca, Linares y online.",
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
    name: CONTACTO.marca,
    description:
      "Atención de matronería: salud ginecológica, sexología, anticoncepción, control de embarazo, climaterio y procedimientos.",
    url: SITIO,
    telephone: CONTACTO.telefono,
    email: CONTACTO.email,
    address: SEDES.map((sede) => ({
      "@type": "PostalAddress",
      streetAddress: sede.direccion,
      addressLocality: sede.ciudad,
      addressRegion: "Región del Maule",
      addressCountry: "CL",
    })),
    areaServed: SEDES.map((s) => s.ciudad),
    medicalSpecialty: "Obstetric",
    priceRange: "$$",
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
