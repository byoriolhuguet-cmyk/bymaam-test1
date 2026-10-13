import { OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/site";

type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile" | "product";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Cabecera SEO completa para una ruta: title, description, canonical absoluta,
 * Open Graph, Twitter, hreflang y JSON-LD. Úsala en `head: () => seo({...})`.
 */
export function seo({
  title,
  description,
  path,
  image = OG_IMAGE,
  imageAlt = "By Maam, bolsos de piel hechos a mano",
  type = "website",
  noindex = false,
  jsonLd,
}: SeoInput) {
  const url = absoluteUrl(path);
  const ld = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return {
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "robots",
        content: noindex
          ? "noindex, nofollow"
          : "index, follow, max-image-preview:large, max-snippet:-1",
      },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "es_ES" },
      { property: "og:type", content: type },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "es-ES", href: url },
      { rel: "alternate", hrefLang: "x-default", href: url },
    ],
    scripts: ld.map((item) => ({
      type: "application/ld+json",
      children: JSON.stringify(item),
    })),
  };
}

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
