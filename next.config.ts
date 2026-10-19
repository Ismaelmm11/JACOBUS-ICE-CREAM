import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Hay un pnpm-lock.yaml suelto en el perfil del usuario: fijamos la raíz al proyecto.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
