import type { MetadataRoute } from "next";
import { SITIO_URL as SITIO } from "@/lib/datos";


export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/privacidad", "/terminos"] },
    sitemap: `${SITIO}/sitemap.xml`,
  };
}
