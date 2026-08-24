import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El proyecto vive dentro de un directorio con otro package-lock.json más
  // arriba; esto fija la raíz para que Turbopack no busque fuera.
  turbopack: { root: __dirname },
};

export default nextConfig;
