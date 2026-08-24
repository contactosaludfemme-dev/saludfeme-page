import type { MetadataRoute } from "next";
import { ARTICULOS } from "@/lib/blog";
import { SITIO_URL as SITIO } from "@/lib/datos";


export default function sitemap(): MetadataRoute.Sitemap {
  const fijas = [
    { url: SITIO, priority: 1 },
    { url: `${SITIO}/blog`, priority: 0.8 },
    { url: `${SITIO}/privacidad`, priority: 0.3 },
    { url: `${SITIO}/terminos`, priority: 0.3 },
  ];

  const articulos = ARTICULOS.map((a) => ({
    url: `${SITIO}/blog/${a.slug}`,
    lastModified: a.fecha,
    priority: 0.7,
  }));

  return [...fijas, ...articulos];
}
