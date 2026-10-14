import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowUpRight, Instagram } from "lucide-react";
import type { CSSProperties } from "react";

import { ProductTile } from "@/components/site/ProductTile";
import { ShareButtons } from "@/components/site/ShareButtons";
import { PRODUCTS, formatPrice, getProduct, productPath, productSrcSet } from "@/data/products";
import { breadcrumbLd, seo } from "@/lib/seo";
import { INSTAGRAM_URL, SITE_URL, VINTED_URL } from "@/lib/site";

export const Route = createFileRoute("/coleccion/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return seo({ title: "Pieza no encontrada | By Maam", description: "Esta pieza no existe.", path: "/coleccion", noindex: true });
    const url = `${SITE_URL}${productPath(p.slug)}`;
    const description = `${p.name} ${p.color.toLowerCase()}: ${p.short} ${p.family === "Bolsos" ? "Bolso" : "Funda"} hecho a mano, edición limitada. ${formatPrice(p.price)}.`;
    return seo({
      title: `${p.name} ${p.color.toLowerCase()}, hecho a mano | By Maam`,
      description,
      path: productPath(p.slug),
      image: `${SITE_URL}${p.image}`,
      imageAlt: p.alt,
      type: "product",
      jsonLd: [
        breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Colección", path: "/coleccion" },
          { name: p.name, path: productPath(p.slug) },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Product",
          "@id": `${url}#product`,
          name: `${p.name} ${p.color}`,
          description: p.description,
          sku: p.slug,
          category: p.family === "Bolsos" ? "Bolsos hechos a mano" : "Fundas de piel hechas a mano",
          color: p.color,
          material: "Piel",
          image: [`${SITE_URL}${p.image}`],
          url,
          brand: { "@type": "Brand", name: "By Maam" },
          manufacturer: { "@id": `${SITE_URL}/#organization` },
          offers: {
            "@type": "Offer",
            url: p.vinted || VINTED_URL,
            price: p.price.toFixed(2),
            priceCurrency: "EUR",
            availability: p.available ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": `${SITE_URL}/#organization` },
          },
        },
      ],
    });
  },
  notFoundComponent: () => (
    <div className="linen flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-6 text-4xl">Esta pieza ya no está</h1>
        <p className="mt-4 text-sm text-muted-foreground">Puede que se haya vendido. Echa un vistazo al resto de la colección.</p>
        <div className="mt-8"><Link to="/coleccion" className="btn-solid">Ver la colección</Link></div>
      </div>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const related = [...PRODUCTS.filter((x) => x.slug !== p.slug)]
    .sort((a, b) => Number(b.family === p.family) - Number(a.family === p.family))
    .slice(0, 4);

  const specs: [string, string][] = [
    ["Tipo", p.family === "Bolsos" ? "Bolso" : "Funda para ordenador"],
    ["Color", p.color],
    ["Material", p.leather],
    ["Flecos", p.fringe],
    ["Herrajes", p.studs],
    ...(p.strap ? ([["Correa", "Incluida"]] as [string, string][]) : []),
    ["Hecho en", "Barcelona, a mano"],
    ["Serie", "Edición limitada"],
  ];

  return (
    <>
      <article className="pdp" aria-labelledby="pieza-titulo">
        <div className="pdp-media">
          <img
            src={p.image}
            srcSet={productSrcSet(p)}
            sizes="(min-width: 1024px) 60vw, 100vw"
            alt={p.alt}
            width={p.w}
            height={p.h}
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="pdp-info" data-product-slug={p.slug}>
          <nav aria-label="Migas de pan" className="pdp-crumbs">
            <ol>
              <li><Link to="/">Inicio</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to="/coleccion">Colección</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{p.name}</li>
            </ol>
          </nav>

          <h1 id="pieza-titulo" className="pdp-title" data-reveal>
            {p.name}
          </h1>
          <p className="pdp-price" data-reveal style={{ ["--d" as string]: "80ms" }}>
            {formatPrice(p.price)}
          </p>
          <p className="pdp-color" data-reveal style={{ ["--d" as string]: "140ms" }}>
            <span className="swatch" style={{ "--sw": p.swatch } as CSSProperties} aria-hidden="true" />
            {p.color}
          </p>

          {!p.available && <p className="mt-4 text-sm text-wine">Esta pieza está agotada. Escríbeme y te hago una igual.</p>}

          <div className="pdp-actions" data-reveal style={{ ["--d" as string]: "200ms" }}>
            <a href={p.vinted || VINTED_URL} target="_blank" rel="noopener" className="btn-solid w-full">
              Comprar en Vinted <ArrowUpRight className="h-4 w-4" aria-hidden="true" strokeWidth={1.5} />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="btn-ghost w-full">
              <Instagram className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={1.5} />
              Preguntar por Instagram
            </a>
          </div>

          <p className="pdp-desc">{p.description}</p>

          <details className="pdp-acc" open>
            <summary>Características</summary>
            <dl aria-label="Características">
              {specs.map(([k, v]) => (
                <div key={k} className="spec-row">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </details>
          <details className="pdp-acc">
            <summary>Envío y devoluciones</summary>
            <p>
              Envío con número de seguimiento. Tienes 14 días para devolverla si no te convence.{" "}
              <Link to="/devoluciones" className="miu-link">Ver la política de devoluciones</Link>
            </p>
          </details>
          <details className="pdp-acc">
            <summary>¿La quieres en otro color?</summary>
            <p>
              Marta puede hacerla en otra combinación de piel, flecos y tachuelas.{" "}
              <Link to="/pedidos" className="miu-link">Encargar un modelo personalizado</Link>
            </p>
          </details>

          <div className="mt-8"><ShareButtons title={`${p.name} · By Maam`} path={productPath(p.slug)} /></div>
        </div>
      </article>

      <section className="pb-24 pt-16 md:pb-32" aria-labelledby="mas-piezas">
        <h2 id="mas-piezas" className="miu-title miu-look-title mb-8" data-reveal>
          Más piezas hechas a mano
        </h2>
        <div className="miu-grid">
          {related.map((r, i) => (
            <div key={r.slug} data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
              <ProductTile product={r} sizes="(min-width: 1024px) 25vw, 50vw" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
