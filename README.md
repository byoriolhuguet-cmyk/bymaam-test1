# By Maam | web de bolsos hechos a mano

Sitio estático (TanStack Start + React + Tailwind v4), prerenderizado: cada página sale como HTML completo
(buenas para Google, asistentes de IA y agentes que no ejecutan JavaScript) y se "hidrata" después.

## Desplegar en Netlify
- Build command: `npm run build` · Publish directory: `dist/client` (ya está en `netlify.toml`). Node 22.
- Local: `npm install` → `npm run dev` (desarrollo) · `npm run build` (producción).

## Dónde se edita cada cosa
| Qué | Dónde |
| --- | --- |
| Piezas, precios, descripciones, URL de Vinted por pieza, `available: false` si se agota | `src/data/products.json` |
| Dominio (`siteUrl`), email, Instagram, Vinted, fecha de actualización | `src/data/site.json` |
| Fotos de Instagram en portada | `src/data/instagram.ts` (+ archivos en `public/images/instagram/`) |
| Formularios (Formspree), newsletter, GA4 | `src/lib/site.ts` |
| Colores y animaciones | `src/styles.css` |

`npm run build` regenera solo `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt` y `products.json` a partir de esos JSON.
Para añadir una pieza: foto en `public/images/products/<slug>.webp` (+ `<slug>-640.webp`) y una entrada en `products.json`. Su ficha
(`/coleccion/<slug>`), JSON-LD y sitemap se crean solos.

## Diseño y animación
- Pantalla de carga con contador 000→100, secuencia de piezas y cortina vino (solo portada, una vez por sesión).
- Transiciones entre páginas con View Transitions API (cortina vino) y foto del producto que viaja de la tarjeta a la ficha.
- Cabecera que se oculta al bajar, menú a pantalla completa, cinta infinita, carril horizontal fijado por scroll,
  titulares con máscara, texto que se ilumina palabra a palabra, paralaje y reveals con cortina.
- `prefers-reduced-motion`: todo estático y visible. Sin JS: todo el contenido visible.
- Fuentes autoalojadas (Fraunces + DM Sans), imágenes WebP con `srcset`, sin peticiones a Google Fonts.

## SEO (keyword principal: "bolsos hechos a mano")
- H1 y title con la keyword; descripciones únicas, canonical absoluta, Open Graph/Twitter, hreflang.
- JSON-LD: Organization, WebSite, CollectionPage/ItemList, Product (con oferta), BreadcrumbList, FAQPage.
- Una URL por pieza (`/coleccion/bolso-nox`), sitemap con imágenes, robots que permiten rastreo.

## Navegación agéntica
- `llms.txt` / `llms-full.txt` y `products.json` (catálogo estructurado) en la raíz.
- HTML semántico, landmarks, `data-product-*` en tarjetas, enlaces rastreables.
- WebMCP (`navigator.modelContext`, early preview/origin trial en Chrome 2026): herramientas de solo lectura
  `buscar_piezas`, `ver_pieza` y `como_comprar_y_contactar`. Se registran solo si el navegador lo soporta.

## Pendiente (Marta)
1. Comprar dominio → `siteUrl` en `site.json`.
2. IDs de Formspree y endpoint de newsletter (`src/lib/site.ts`). Sin ellos, la banda de newsletter se sustituye por un botón de Instagram y no se muestra el popup de salida.
3. Fotos de Instagram (`src/data/instagram.ts`) y URL de Vinted de cada pieza.
4. Revisar datos que no cuadraban en la web anterior: precios (la colección decía 38,50 € / 42,90 €, el catálogo 35,90 € / 39,90 €; ahora manda el catálogo) y plazos (portada "menos de 7 días" vs FAQ "~5 días + 3-4 de envío").
