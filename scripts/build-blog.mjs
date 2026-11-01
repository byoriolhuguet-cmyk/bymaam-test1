/**
 * Genera los datos del blog a partir de src/content/blog/*.md:
 *   src/generated/blog/index.json        (listado ligero: lo leen /blog, el sitemap y el prerender)
 *   src/generated/blog/posts/<slug>.json (HTML de cada artículo, se carga solo en su página)
 *   public/feed.xml                      (RSS para lectores, agregadores y buscadores de IA)
 *
 *   node scripts/build-blog.mjs           valida y genera (lo llama generate-seo.mjs en el prebuild)
 *   node scripts/build-blog.mjs --check   solo valida (npm run blog:check)
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { TYPES, readPosts, validatePosts } from "./blog-core.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function buildBlog({ check = false } = {}) {
  process.chdir(ROOT);
  const site = JSON.parse(readFileSync("src/data/site.json", "utf8"));
  const products = JSON.parse(readFileSync("src/data/products.json", "utf8"));
  const posts = readPosts();
  const { errors, warnings } = validatePosts(posts, products);

  for (const w of warnings) console.warn(`Blog (aviso): ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`Blog (error): ${e}`);
    throw new Error(`El blog tiene ${errors.length} error(es). Corrígelos antes de publicar.`);
  }
  if (check) {
    console.log(`Blog: ${posts.length} artículo(s) válidos.`);
    return posts;
  }

  const meta = (p) => ({
    slug: p.slug,
    path: p.path,
    date: p.date,
    updated: p.updated,
    type: p.type,
    typeLabel: TYPES[p.type].label,
    title: p.title,
    description: p.description,
    keyword: p.keyword,
    keywords: p.keywords,
    products: p.products,
    tldr: p.tldr,
    words: p.words,
    readingMinutes: p.readingMinutes,
  });

  rmSync("src/generated/blog", { recursive: true, force: true });
  mkdirSync("src/generated/blog/posts", { recursive: true });
  writeFileSync("src/generated/blog/index.json", `${JSON.stringify(posts.map(meta), null, 2)}\n`);
  for (const p of posts) {
    writeFileSync(
      `src/generated/blog/posts/${p.slug}.json`,
      `${JSON.stringify({ ...meta(p), html: p.html, toc: p.toc, faq: p.faq, sources: p.sources }, null, 2)}\n`,
    );
  }

  const url = (path) => `${site.siteUrl}${path}`;
  const rfc822 = (d) => new Date(`${d}T08:00:00+01:00`).toUTCString();
  mkdirSync("public", { recursive: true });
  writeFileSync(
    "public/feed.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog de ${esc(site.name)}</title>
    <link>${url("/blog")}</link>
    <description>Actualidad de moda cada lunes y guías de compra de bolsos hechos a mano cada jueves.</description>
    <language>es-ES</language>
    <atom:link href="${url("/feed.xml")}" rel="self" type="application/rss+xml" />
${posts
  .slice(0, 50)
  .map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${url(p.path)}</link>
      <guid isPermaLink="true">${url(p.path)}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <category>${esc(TYPES[p.type].label)}</category>
      <description>${esc(p.tldr)}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`,
  );
  console.log(`Blog: ${posts.length} artículo(s), feed.xml`);
  return posts;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    buildBlog({ check: process.argv.includes("--check") });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
