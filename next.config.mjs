/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        // imagen de prueba para alumnos
        protocol: 'https',
        hostname: 'www.shutterstock.com'
      }
    ]
  },
  output: "standalone",
}

export default nextConfig;