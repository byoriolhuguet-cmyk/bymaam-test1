import { Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { ProductTile } from "@/components/site/ProductTile";
import { GUIDES, HUBS, guidePath, hubProducts, type Hub } from "@/data/guides";
import { formatPrice } from "@/data/products";
import { breadcrumbLd, seo } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

/** Cabecera SEO de un hub: canonical, migas de pan y lista de piezas. */
export function hubHead(hub: Hub) {
  const items = hubProducts(hub);
  return seo({
    title: hub.title,
    description: hub.description,
    path: hub.path,
    jsonLd: [
      breadcrumbLd([
        { name: "Inicio", path: "/" },
        { name: "Colección", path: "/coleccion" },
        { name: hub.name, path: hub.path },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: hub.h1,
        description: hub.description,
        url: `${SITE_URL}${hub.path}`,
        inLanguage: "es-ES",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: items.length,
          itemListElement: items.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/coleccion/${p.slug}`,
            name: `${p.name} ${p.color}`,
          })),
        },
      },
    ],
  });
}

/** Hub temático: piezas primero, después el texto que responde a la búsqueda y los enlaces hacia dentro. */
export function HubPage({ hub }: { hub: Hub }) {
  const items = hubProducts(hub);
  const others = HUBS.filter((h) => h.path !== hub.path);
  const guides = hub.guides.map((slug) => GUIDES.find((g) => g.slug === slug)!);
  const from = Math.min(...items.map((p) => p.price));

  return (
    <>
      <PageHeader
        title={hub.h1}
        lead={`${hub.lead} Desde ${formatPrice(from)}.`}
        crumbs={[
          { name: "Inicio", to: "/" },
          { name: "Colección", to: "/coleccion" },
        ]}
      />

      <section
        className="section-y pt-12 md:pt-16"
        aria-label={`Piezas: ${hub.name.toLowerCase()}`}
      >
        <div className="container-brand">
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <div key={p.slug} data-reveal style={{ ["--d" as string]: `${(i % 3) * 60}ms` }}>
                <ProductTile
                  product={p}
                  headingLevel={2}
                  priority={i === 0}
                  sizes="(min-width: 1408px) 27rem, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-border bg-card section-y"
        aria-label={`Sobre los ${hub.name.toLowerCase()}`}
      >
        <div className="container-brand grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-3xl leading-tight md:text-4xl">{hub.blocks[0]!.heading}</h2>
            <nav aria-label="Seguir explorando" className="space-y-3 text-sm">
              {guides.map((g) => (
                <p key={g.slug}>
                  <Link to={guidePath(g.slug) as "/"} className="link-draw tap">
                    {g.h1}
                  </Link>
                </p>
              ))}
              {others.map((h) => (
                <p key={h.path}>
                  <Link to={h.path} className="link-draw tap">
                    {h.name}
                  </Link>
                </p>
              ))}
              <p>
                <Link to="/coleccion" className="link-draw tap">
                  Toda la colección
                </Link>
              </p>
            </nav>
          </div>
          <div className="space-y-10 leading-relaxed text-muted-foreground">
            {hub.blocks.map((b, i) => (
              <div key={b.heading} className="space-y-4">
                {i > 0 && (
                  <h2 className="font-display text-2xl text-foreground md:text-3xl">{b.heading}</h2>
                )}
                {b.paragraphs.map((t) => (
                  <p key={t.slice(0, 32)} className="max-w-[65ch]">
                    {t}
                  </p>
                ))}
              </div>
            ))}
            <p className="max-w-[65ch]">
              ¿Otra combinación?{" "}
              <Link to="/pedidos" className="link-draw text-foreground">
                Encarga un modelo personalizado
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
