import { Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { HUBS, guidePath, type Guide } from "@/data/guides";
import { formatPrice, getProduct, productSrcSet } from "@/data/products";
import { breadcrumbLd, seo } from "@/lib/seo";
import { FOUNDER, LAST_UPDATED_ISO, SITE_URL } from "@/lib/site";

/** Cabecera SEO de una guía: artículo con autora y migas de pan. */
export function guideHead(guide: Guide) {
  const path = guidePath(guide.slug);
  return seo({
    title: guide.title,
    description: guide.description,
    path,
    type: "article",
    jsonLd: [
      breadcrumbLd([
        { name: "Inicio", path: "/" },
        { name: "Guías", path: "/guias" },
        { name: guide.h1, path },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.h1,
        description: guide.description,
        inLanguage: "es-ES",
        url: `${SITE_URL}${path}`,
        dateModified: LAST_UPDATED_ISO,
        author: { "@type": "Person", name: FOUNDER },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: `${SITE_URL}${path}`,
      },
    ],
  });
}

/** Pieza enlazada dentro de una guía: foto pequeña y texto descriptivo (nunca "ver pieza"). */
function InlineProduct({ slug }: { slug: string }) {
  const p = getProduct(slug);
  if (!p) return null;
  return (
    <Link to="/coleccion/$slug" params={{ slug: p.slug }} className="guide-product group">
      <span className="guide-product-media">
        <img
          src={p.image640}
          srcSet={productSrcSet(p)}
          sizes="7rem"
          alt=""
          width={p.w}
          height={p.h}
          loading="lazy"
          decoding="async"
        />
      </span>
      <span>
        <span className="block font-display text-lg text-foreground">{p.name}</span>
        <span className="block text-sm text-muted-foreground">
          {p.family === "Fundas" ? "Funda para portátil" : "Bolso con flecos"}{" "}
          {p.color.toLowerCase()}, {formatPrice(p.price)}
        </span>
      </span>
    </Link>
  );
}

export function GuidePage({ guide }: { guide: Guide }) {
  const hub = HUBS.find((h) => h.path === guide.hub)!;
  return (
    <>
      <PageHeader
        title={guide.h1}
        lead={guide.lead}
        crumbs={[
          { name: "Inicio", to: "/" },
          { name: "Guías", to: "/guias" },
        ]}
      />
      <article className="container-brand pb-24 pt-4 md:pb-32">
        <div className="mx-auto max-w-2xl space-y-14">
          {guide.blocks.map((b) => (
            <section key={b.heading} className="space-y-4" aria-label={b.heading}>
              <h2 className="text-2xl leading-tight md:text-3xl">{b.heading}</h2>
              {b.paragraphs.map((t) => (
                <p key={t.slice(0, 32)} className="leading-relaxed text-muted-foreground">
                  {t}
                </p>
              ))}
              {b.list && (
                <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
                  {b.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
              {b.products && (
                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                  {b.products.map((slug) => (
                    <InlineProduct key={slug} slug={slug} />
                  ))}
                </div>
              )}
            </section>
          ))}
          <p className="border-t border-border pt-8 text-muted-foreground">
            Sigue con{" "}
            <Link to={hub.path} className="link-draw text-foreground">
              {hub.name.toLowerCase()}
            </Link>{" "}
            o mira{" "}
            <Link to="/coleccion" className="link-draw text-foreground">
              toda la colección
            </Link>
            .
          </p>
        </div>
      </article>
    </>
  );
}
