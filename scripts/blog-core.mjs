/**
 * Blog de By Maam: lectura, validación y conversión de los artículos de src/content/blog/*.md.
 *
 * Cada artículo es un Markdown con una cabecera sencilla (clave: valor) y un cuerpo con un
 * subconjunto de Markdown: ## y ### títulos, párrafos, listas, citas, tablas, **negrita**,
 * *cursiva* y [enlaces](/ruta). Lo usan scripts/build-blog.mjs (genera los JSON que lee la web)
 * y `npm run blog:check` (valida antes de publicar). Sin dependencias.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const BLOG_DIR = "src/content/blog";

export const TYPES = {
  actualidad: { label: "Actualidad", minWords: 700 },
  compra: { label: "Guía de compra", minWords: 900 },
};

/** Rutas internas que existen fuera del blog (las fichas, hubs y guías se añaden aparte). */
const STATIC_ROUTES = [
  "/",
  "/coleccion",
  "/sobre-mi",
  "/pedidos",
  "/faq",
  "/contacto",
  "/devoluciones",
  "/privacidad",
  "/aviso-legal",
  "/cookies",
  "/bolsos-con-flecos",
  "/bolsos-con-tachuelas",
  "/fundas-portatil",
  "/guias",
  "/guias/como-cuidar-un-bolso-con-flecos",
  "/guias/como-combinar-un-bolso-con-flecos",
  "/blog",
];

const FILE_RE = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;

export const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Texto plano de una línea Markdown (para FAQ, recuento de palabras y llms.txt). */
export const plain = (s) =>
  s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();

function parseFrontmatter(src, file) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: falta la cabecera entre líneas ---`);
  const data = {};
  for (const line of m[1].split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const i = line.indexOf(":");
    if (i < 0) throw new Error(`${file}: línea de cabecera sin "clave: valor": ${line}`);
    data[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^"(.*)"$/, "$1");
  }
  return { data, body: m[2] };
}

const list = (v) =>
  v
    ? v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

function inline(text, links) {
  let out = escapeHtml(text);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    const raw = href.replace(/&amp;/g, "&");
    links.push(raw);
    if (raw.startsWith("/")) return `<a href="${href}" class="link-draw">${label}</a>`;
    return `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  return out;
}

/** Markdown → HTML, índice de secciones, FAQ, fuentes y enlaces encontrados. */
export function renderMarkdown(body) {
  const lines = body.replace(/\r/g, "").split("\n");
  const html = [];
  const toc = [];
  const faq = [];
  const sources = [];
  const links = [];
  let section = "";
  let para = [];
  let listType = null;
  let listItems = [];
  let quote = [];
  let table = [];
  let faqQ = null;
  let faqA = [];

  const flushFaq = () => {
    if (faqQ && faqA.length) faq.push({ q: faqQ, a: faqA.join(" ") });
    faqQ = null;
    faqA = [];
  };
  const flushPara = () => {
    if (!para.length) return;
    const text = para.join(" ");
    html.push(`<p>${inline(text, links)}</p>`);
    if (faqQ) faqA.push(plain(text));
    para = [];
  };
  const flushList = () => {
    if (!listType) return;
    html.push(
      `<${listType}>${listItems.map((li) => `<li>${inline(li, links)}</li>`).join("")}</${listType}>`,
    );
    if (section === "fuentes") {
      for (const li of listItems) {
        const m = li.match(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/);
        if (m) sources.push({ name: m[1], url: m[2] });
      }
    }
    if (faqQ) faqA.push(listItems.map(plain).join("; "));
    listType = null;
    listItems = [];
  };
  const flushQuote = () => {
    if (!quote.length) return;
    html.push(`<blockquote><p>${inline(quote.join(" "), links)}</p></blockquote>`);
    quote = [];
  };
  const flushTable = () => {
    if (!table.length) return;
    const rows = table
      .filter((r) => !/^\|?\s*:?-{2,}/.test(r))
      .map((r) =>
        r
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((c) => c.trim()),
      );
    const [head, ...rest] = rows;
    html.push(
      `<div class="post-table"><table><thead><tr>${head.map((c) => `<th scope="col">${inline(c, links)}</th>`).join("")}</tr></thead><tbody>${rest
        .map((r) => `<tr>${r.map((c) => `<td>${inline(c, links)}</td>`).join("")}</tr>`)
        .join("")}</tbody></table></div>`,
    );
    table = [];
  };
  const flushAll = () => {
    flushPara();
    flushList();
    flushQuote();
    flushTable();
  };

  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      flushAll();
      continue;
    }
    const h = t.match(/^(#{2,3})\s+(.+)$/);
    if (h) {
      flushAll();
      const level = h[1].length;
      const text = plain(h[2]);
      const id = slugify(text);
      if (level === 2) {
        flushFaq();
        section = /^preguntas frecuentes/i.test(text)
          ? "faq"
          : /^fuentes/i.test(text)
            ? "fuentes"
            : "";
        toc.push({ id, text });
      } else if (section === "faq") {
        flushFaq();
        faqQ = text;
      }
      html.push(`<h${level} id="${id}">${inline(h[2], links)}</h${level}>`);
      continue;
    }
    if (t.startsWith("|")) {
      flushPara();
      flushList();
      flushQuote();
      table.push(t);
      continue;
    }
    const li = t.match(/^(-|\d+\.)\s+(.+)$/);
    if (li) {
      flushPara();
      flushQuote();
      flushTable();
      const type = li[1] === "-" ? "ul" : "ol";
      if (listType && listType !== type) flushList();
      listType = type;
      listItems.push(li[2]);
      continue;
    }
    if (t.startsWith(">")) {
      flushPara();
      flushList();
      flushTable();
      quote.push(t.replace(/^>\s?/, ""));
      continue;
    }
    flushList();
    flushQuote();
    flushTable();
    para.push(t);
  }
  flushAll();
  flushFaq();

  const words = plain(body.replace(/^[#>|-]+\s?/gm, " "))
    .split(/\s+/)
    .filter(Boolean).length;
  return { html: html.join("\n"), toc, faq, sources, links, words };
}

/** Lee todos los artículos, ordenados del más reciente al más antiguo. */
export function readPosts(root = ".") {
  const dir = join(root, BLOG_DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const m = file.match(FILE_RE);
      if (!m) throw new Error(`${file}: el nombre debe ser AAAA-MM-DD-slug-en-minusculas.md`);
      const { data, body } = parseFrontmatter(readFileSync(join(dir, file), "utf8"), file);
      const rendered = renderMarkdown(body);
      return {
        file,
        slug: m[2],
        path: `/blog/${m[2]}`,
        date: data.date || m[1],
        updated: data.updated || data.date || m[1],
        type: data.type,
        title: data.title || "",
        description: data.description || "",
        keyword: data.keyword || "",
        keywords: list(data.keywords),
        products: list(data.products),
        tldr: data.tldr || "",
        body,
        ...rendered,
        readingMinutes: Math.max(1, Math.round(rendered.words / 220)),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

/**
 * Reglas de calidad (SEO, buscadores de IA y marca). Los errores bloquean la publicación;
 * los avisos se muestran pero no la paran.
 */
export function validatePosts(posts, products, guides = []) {
  const productSlugs = new Set(products.map((p) => p.slug));
  const routes = new Set([
    ...STATIC_ROUTES,
    ...guides,
    ...products.map((p) => `/coleccion/${p.slug}`),
    ...posts.map((p) => p.path),
  ]);
  const errors = [];
  const warnings = [];
  const seen = new Map();

  for (const p of posts) {
    const e = (msg) => errors.push(`${p.file}: ${msg}`);
    const w = (msg) => warnings.push(`${p.file}: ${msg}`);
    const type = TYPES[p.type];

    if (seen.has(p.slug)) e(`slug repetido (ya existe en ${seen.get(p.slug)})`);
    seen.set(p.slug, p.file);
    if (!type) e(`type debe ser "actualidad" o "compra"`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) e("date debe ser AAAA-MM-DD");
    if (!p.title) e("falta title");
    else if (p.title.length > 70) w(`title largo (${p.title.length} caracteres; mejor 50-65)`);
    if (p.description.length < 110 || p.description.length > 165)
      e(`description debe tener 110-165 caracteres (tiene ${p.description.length})`);
    if (!p.keyword) e("falta keyword (la búsqueda principal del artículo)");
    if (p.keywords.length < 3) e("keywords: al menos 3, separadas por comas");
    const tldrWords = p.tldr.split(/\s+/).filter(Boolean).length;
    if (tldrWords < 30 || tldrWords > 90) e(`tldr debe tener 30-90 palabras (tiene ${tldrWords})`);
    for (const s of p.products)
      if (!productSlugs.has(s)) e(`products: "${s}" no existe en src/data/products.json`);
    if (p.products.length < (p.type === "compra" ? 3 : 1))
      e(`products: al menos ${p.type === "compra" ? 3 : 1} pieza(s) de la colección`);

    if (type && p.words < type.minWords)
      e(`cuerpo corto: ${p.words} palabras (mínimo ${type.minWords})`);
    if (p.toc.length < 4) e("al menos 4 secciones ## (incluida Preguntas frecuentes)");
    if (p.faq.length < 3) e('falta "## Preguntas frecuentes" con al menos 3 preguntas ###');
    if (/^#\s/m.test(p.body)) e("no uses # (H1) en el cuerpo: el título ya es el H1");

    const internal = p.links.filter((l) => l.startsWith("/"));
    const external = p.links.filter((l) => !l.startsWith("/"));
    if (internal.length < 5) e(`al menos 5 enlaces internos (tiene ${internal.length})`);
    for (const l of internal) {
      const path = l.split(/[?#]/)[0].replace(/\/$/, "") || "/";
      if (!routes.has(path)) e(`enlace interno roto: ${l}`);
    }
    for (const l of external) if (!l.startsWith("https://")) e(`enlace externo sin https: ${l}`);
    if (p.links.some((l) => /vinted\./i.test(l)))
      e(
        "no enlaces a Vinted desde el blog: enlaza a la ficha (/coleccion/...) y la ficha lleva a Vinted",
      );
    const productLinks = new Set(internal.filter((l) => l.startsWith("/coleccion/")));
    if (productLinks.size < (p.type === "compra" ? 3 : 2))
      e(`enlaza al menos ${p.type === "compra" ? 3 : 2} fichas de producto distintas`);
    if (
      !internal.some((l) => /^\/(bolsos-con-flecos|bolsos-con-tachuelas|fundas-portatil)/.test(l))
    )
      e("enlaza al menos un hub (/bolsos-con-flecos, /bolsos-con-tachuelas o /fundas-portatil)");
    if (!internal.some((l) => l.startsWith("/blog/")) && posts.length > 1)
      w("enlaza al menos un artículo anterior del blog");

    if (p.type === "actualidad" && p.sources.length < 3)
      e('actualidad: "## Fuentes" con al menos 3 enlaces https a las noticias citadas');

    const text = `${p.title}\n${p.description}\n${p.tldr}\n${p.body}`;
    if (/[–—]/.test(text)) e("sin rayas (— o –): usa comas, dos puntos o punto");
    if (
      /piel\s+(real|aut[eé]ntica|genuina|natural|de vaca|vacuna)|cuero\s+(real|aut[eé]ntico|genuino)/i.test(
        text,
      )
    )
      e("los bolsos son de piel sintética: no digas piel real, auténtica, genuina ni natural");
    if (/\b(hecho|hechos|cosido|cosidos|fabricad[oa]s?)\s+(a mano\s+)?en\s+galicia/i.test(text))
      e("las piezas se hacen en Barcelona (Marta es de Galicia, pero cose en Barcelona)");
    const prices = [...text.matchAll(/(\d+[.,]\d{2})\s?€/g)].map((m) =>
      Number(m[1].replace(",", ".")),
    );
    const known = new Set(products.map((x) => x.price));
    for (const n of prices)
      if (!known.has(n))
        w(`precio ${n} € no coincide con ningún producto; revisa que no sea inventado`);
  }
  return { errors, warnings };
}
