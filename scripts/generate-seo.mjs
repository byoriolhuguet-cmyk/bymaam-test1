/**
 * Genera, a partir de src/data/*.json (fuente única):
 *   public/sitemap.xml      (con imágenes, para SEO de imagen)
 *   public/robots.txt
 *   public/llms.txt         (resumen para asistentes de IA, estándar llms.txt)
 *   public/llms-full.txt    (contenido completo en Markdown)
 *   public/products.json    (catálogo estructurado para agentes)
 * Se ejecuta solo en `npm run build` (prebuild). También: `npm run seo`.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Siempre trabaja desde la raíz del proyecto, da igual desde dónde se lance.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(ROOT);
for (const f of ["src/data/site.json", "src/data/products.json"]) {
  if (!existsSync(f)) {
    console.error(`Falta ${f}. Sube la carpeta src/data completa (site.json, products.json, products.ts, instagram.ts).`);
    process.exit(1);
  }
}

const site = JSON.parse(readFileSync("src/data/site.json", "utf8"));
const products = JSON.parse(readFileSync("src/data/products.json", "utf8"));
const url = (p) => `${site.siteUrl}${p}`;
const eur = (n) => `${n.toFixed(2).replace(".", ",")} €`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

mkdirSync("public", { recursive: true });

const pages = [
  { path: "/", priority: "1.0", freq: "weekly" },
  { path: "/coleccion", priority: "0.9", freq: "weekly" },
  ...products.map((p) => ({ path: `/coleccion/${p.slug}`, priority: "0.8", freq: "weekly", image: p })),
  { path: "/bolsos-con-flecos", priority: "0.8", freq: "weekly" },
  { path: "/bolsos-con-tachuelas", priority: "0.7", freq: "weekly" },
  { path: "/fundas-portatil", priority: "0.7", freq: "weekly" },
  { path: "/guias", priority: "0.5", freq: "monthly" },
  { path: "/guias/como-cuidar-un-bolso-con-flecos", priority: "0.5", freq: "monthly" },
  { path: "/guias/como-combinar-un-bolso-con-flecos", priority: "0.5", freq: "monthly" },
  { path: "/sobre-mi", priority: "0.6", freq: "monthly" },
  { path: "/pedidos", priority: "0.6", freq: "monthly" },
  { path: "/faq", priority: "0.6", freq: "monthly" },
  { path: "/contacto", priority: "0.5", freq: "monthly" },
  { path: "/devoluciones", priority: "0.3", freq: "yearly" },
  { path: "/privacidad", priority: "0.2", freq: "yearly" },
  { path: "/aviso-legal", priority: "0.2", freq: "yearly" },
  { path: "/cookies", priority: "0.2", freq: "yearly" },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (p) => `  <url>
    <loc>${url(p.path === "/" ? "/" : p.path)}</loc>
    <lastmod>${site.lastUpdatedIso}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>${
      p.image
        ? `
    <image:image>
      <image:loc>${url(p.image.image)}</image:loc>
      <image:title>${esc(p.image.name + " " + p.image.color)}</image:title>
      <image:caption>${esc(p.image.alt)}</image:caption>
    </image:image>`
        : ""
    }
  </url>`,
  )
  .join("\n")}
</urlset>
`;
writeFileSync("public/sitemap.xml", sitemap);

writeFileSync(
  "public/robots.txt",
  `# By Maam: se permite todo el rastreo, incluidos los asistentes de IA que citan y recomiendan.
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${url("/sitemap.xml")}
`,
);

const list = products.map((p) => `- [${p.name} (${p.color}, ${eur(p.price)})](${url("/coleccion/" + p.slug)}): ${p.short}`).join("\n");

writeFileSync(
  "public/llms.txt",
  `# ${site.name}

> ${site.tagline} de piel sintética con flecos y tachuelas, diseñados y cosidos a mano por ${site.founder} en Barcelona (España). Ediciones limitadas, correa incluida en los bolsos. Se compran en Vinted o por Instagram.

By Maam es una marca artesanal de bolsos y fundas para portátil de piel sintética, hechos a mano. Cada pieza lleva de 4 a 5 horas de trabajo. Las series son muy cortas.

## Colección
${list}

## Por tipo de pieza
- [Bolsos con flecos](${url("/bolsos-con-flecos")})
- [Bolsos con tachuelas](${url("/bolsos-con-tachuelas")})
- [Fundas para portátil](${url("/fundas-portatil")})

## Guías
- [Cómo cuidar un bolso con flecos](${url("/guias/como-cuidar-un-bolso-con-flecos")})
- [Cómo combinar un bolso con flecos](${url("/guias/como-combinar-un-bolso-con-flecos")})

## Cómo comprar
- [Perfil en Vinted (compra protegida)](${site.vintedUrl})
- [Instagram ${site.instagramHandle} (reservas y consultas)](${site.instagramUrl})
- [Pedidos personalizados](${url("/pedidos")}): otro color o un diseño a medida; respuesta en menos de 48 h.

## Información
- [Sobre ${site.founder}](${url("/sobre-mi")})
- [Preguntas frecuentes](${url("/faq")})
- [Contacto](${url("/contacto")}): ${site.email}
- [Política de devoluciones](${url("/devoluciones")})

## Datos estructurados
- [Catálogo en JSON](${url("/products.json")})
- [Resumen completo en Markdown](${url("/llms-full.txt")})
- [Sitemap](${url("/sitemap.xml")})

## Para agentes de IA
- Colección filtrable por URL: \`${url("/coleccion")}?tipo=Bolsos|Fundas&color=<color>&q=<texto>\` (por ejemplo [bolsos negros](${url("/coleccion")}?tipo=Bolsos&color=Negro)).
- WebMCP (navigator.modelContext): herramientas \`buscar_piezas\`, \`ver_pieza\`, \`como_comprar_y_contactar\` (solo lectura), \`ir_a_pagina\` y \`filtrar_coleccion\` (navegan la web).
- El formulario de [contacto](${url("/contacto")}) se expone como herramienta declarativa \`escribir_a_marta\`; el envío lo confirma la persona.
- La compra se hace siempre en Vinted (enlace de cada pieza) o por Instagram; la web no tiene carrito ni pagos.
`,
);

const detail = products
  .map(
    (p) => `### ${p.name}
- Tipo: ${p.family === "Bolsos" ? "Bolso" : "Funda"}
- Color: ${p.color}
- Precio: ${eur(p.price)}
- Material: ${p.leather}; ${p.fringe.toLowerCase()}; ${p.studs.toLowerCase()}
- Correa: ${p.strap ? "incluida" : "no aplica"}
- Disponible: ${p.available ? "sí" : "agotado"}
- URL: ${url("/coleccion/" + p.slug)}
- Descripción: ${p.description}`,
  )
  .join("\n\n");

writeFileSync(
  "public/llms-full.txt",
  `# ${site.name}: bolsos hechos a mano

${site.name} (${site.instagramHandle}) es la marca de ${site.founder}: bolsos y fundas para portátil de piel sintética, hechos a mano en Barcelona, con flecos y tachuelas. Última actualización: ${site.lastUpdated}.

## Colección

${detail}

## Cómo comprar
1. Elige una pieza en ${url("/coleccion")}.
2. Cómprala en Vinted (${site.vintedUrl}) o escribe por Instagram (${site.instagramUrl}) para reservarla o pedir otro color.
3. Marta la prepara a mano y la envía con número de seguimiento.

## Pedidos personalizados
Se puede encargar otro color o un diseño propio en ${url("/pedidos")}. Respuesta en menos de 48 horas por email (${site.email}) o Instagram.

## Contacto
- Email: ${site.email}
- Instagram: ${site.instagramUrl}
- TikTok: ${site.tiktokUrl}
`,
);

writeFileSync(
  "public/products.json",
  JSON.stringify(
    {
      brand: site.name,
      url: site.siteUrl,
      currency: "EUR",
      updated: site.lastUpdatedIso,
      products: products.map((p) => ({
        id: p.slug,
        name: p.name,
        type: p.family === "Bolsos" ? "bolso" : "funda",
        color: p.color,
        price: p.price,
        available: p.available,
        strapIncluded: p.strap,
        leather: p.leather,
        fringe: p.fringe,
        studs: p.studs,
        description: p.description,
        url: url("/coleccion/" + p.slug),
        image: url(p.image),
        buy: p.vinted || site.vintedUrl,
      })),
    },
    null,
    2,
  ),
);

console.log(`SEO: sitemap (${pages.length} URLs), robots, llms.txt, llms-full.txt, products.json`);
