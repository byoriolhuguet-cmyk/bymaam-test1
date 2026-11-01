/**
 * Blog de By Maam. Los artículos se escriben en src/content/blog/*.md y el build los convierte en
 * src/generated/blog (scripts/build-blog.mjs). El listado es ligero; el HTML de cada artículo se
 * carga solo en su página, así el blog puede crecer sin engordar el resto de la web.
 */
import index from "@/generated/blog/index.json";

export type PostType = "actualidad" | "compra";

export type PostMeta = {
  slug: string;
  path: string;
  date: string;
  updated: string;
  type: PostType;
  typeLabel: string;
  title: string;
  description: string;
  keyword: string;
  keywords: string[];
  products: string[];
  tldr: string;
  words: number;
  readingMinutes: number;
};

export type Post = PostMeta & {
  html: string;
  toc: { id: string; text: string }[];
  faq: { q: string; a: string }[];
  sources: { name: string; url: string }[];
};

export const POSTS = index as PostMeta[];

const files = import.meta.glob<{ default: Post }>("../generated/blog/posts/*.json");

export async function loadPost(slug: string): Promise<Post | undefined> {
  const load = files[`../generated/blog/posts/${slug}.json`];
  return load ? (await load()).default : undefined;
}

/** Artículos relacionados: primero los que comparten piezas o tipo, después los más recientes. */
export function relatedPosts(post: PostMeta, n = 3) {
  return POSTS.filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score:
        p.products.filter((s) => post.products.includes(s)).length +
        (p.type === post.type ? 1 : 0) +
        p.keywords.filter((k) => post.keywords.includes(k)).length,
    }))
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, n)
    .map(({ p }) => p);
}

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MONTHS[(m ?? 1) - 1]} de ${y}`;
};
