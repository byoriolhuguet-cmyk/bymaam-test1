// @lovable.dev/vite-tanstack-config ya incluye: TanStack devtools, tanstackStart, viteReact, tailwindcss,
// tsConfigPaths, nitro, inyección VITE_*, alias @ y logger de errores. NO los añadas a mano.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

import products from "./src/data/products.json";

// Páginas que se generan como HTML estático en el build (SEO + agentes sin JS).
const PAGES = [
  "/",
  "/coleccion",
  ...products.map((p: { slug: string }) => `/coleccion/${p.slug}`),
  "/sobre-mi",
  "/pedidos",
  "/faq",
  "/contacto",
  "/privacidad",
  "/aviso-legal",
  "/cookies",
  "/devoluciones",
].map((path) => ({ path, prerender: { enabled: true, outputPath: path === "/" ? "/index.html" : `${path}/index.html` } }));

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    pages: PAGES,
    prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: true, failOnError: true },
  },
  // Sin Nitro: TanStack Start genera el HTML estático (prerender) junto al cliente en dist/client.
  // Dentro de Lovable (LOVABLE_NITRO_PRESET) esta opción se ignora.
  nitro: false,
});
