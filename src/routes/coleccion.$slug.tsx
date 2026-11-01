import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowUpRight, Instagram } from "lucide-react";
import type { CSSProperties } from "react";

import { ProductTile } from "@/components/site/ProductTile";
import { ShareButtons } from "@/components/site/ShareButtons";
import { guidePath, hubFor } from "@/data/guides";
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
    if (!p)
      return seo({
        title: "Pieza no encontrada | By Maam",
        description: "Esta pieza no existe.",
        path: "/coleccion",
        noindex: true,
      });
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
          { name: hubFor(p).name, path: hubFor(p).path },
          { name: p.name, path: productPath(p.slug) },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Product",
          "@id": `${url}#product`,
          name: `${p.name} ${p.color}`,
          description: p.description,
          sku: p.slug,
          category:
            p.family === "Bolsos" ? "Bolsos hechos a mano" : "Fundas para portátil hechas a mano",
          color: p.color,
          material: "Piel sintética",
          image: [`${SITE_URL}${p.image}`],
          url,
          brand: { "@type": "Brand", name: "By Maam" },
          manufacturer: { "@id": `${SITE_URL}/#organization` },
          offers: {
            "@type": "Offer",
            url,
            price: p.price.toFixed(2),
            priceCurrency: "EUR",
            availability: p.available ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": `${SITE_URL}/#organization` },
            // Plazos de /faq: unos 5 días de preparación y 3-4 de transporte. El precio del envío lo calcula Vinted.
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "ES" },
              deliveryTime: {
                "@type": "ShippingDeliveryTime",
                handlingTime: {
                  "@type": "QuantitativeValue",
                  minValue: 1,
                  maxValue: 5,
                  unitCode: "DAY",
                },
                transitTime: {
                  "@type": "QuantitativeValue",
                  minValue: 3,
                  maxValue: 4,
                  unitCode: "DAY",
                },
              },
            },
            // Política de /devoluciones: 14 días, por correo, el envío de vuelta lo paga la clienta.
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "ES",
              returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: 14,
              returnMethod: "https://schema.org/ReturnByMail",
              returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
              merchantReturnLink: `${SITE_URL}/devoluciones`,
            },
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
        <p className="mt-4 text-sm text-muted-foreground">
          Puede que se haya vendido. Echa un vistazo al resto de la colección.
        </p>
        <div className="mt-8">
          <Link to="/coleccion" className="btn-solid">
            Ver la colección
          </Link>
        </div>
      </div>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const hub = hubFor(p);
  // Relacionadas: misma familia primero y, dentro de ella, el mismo herraje
  const score = (x: typeof p) => Number(x.family === p.family) * 2 + Number(x.studs === p.studs);
  const related = PRODUCTS.filter((x) => x.slug !== p.slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3);
  const isBag = p.family === "Bolsos";

  const specs: [string, string][] = [
    ["Tipo", p.family === "Bolsos" ? "Bolso" : "Funda"],
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
      <article className="container-brand pb-16 pt-8 md:pt-12" aria-labelledby="pieza-titulo">
        <nav aria-label="Migas de pan" className="mb-8 text-xs tracking-wide text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="link-draw tap">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/coleccion" className="link-draw tap">
                Colección
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to={hub.path} className="link-draw tap">
                {hub.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">
              {p.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div className="pdp-media">
            <img
              src={p.image}
              srcSet={productSrcSet(p)}
              sizes="(min-width: 1024px) 56vw, 92vw"
              alt={p.alt}
              width={p.w}
              height={p.h}
              fetchPriority="high"
              decoding="async"
              style={{ objectPosition: p.pos }}
            />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start" data-product-slug={p.slug}>
            <h1
              id="pieza-titulo"
              className="text-5xl leading-[0.98] md:text-6xl"
              data-reveal
              style={{ ["--d" as string]: "80ms" }}
            >
              {p.name}
            </h1>
            <p
              className="mt-4 flex items-center gap-3 text-lg"
              data-reveal
              style={{ ["--d" as string]: "160ms" }}
            >
              <span
                className="swatch"
                style={{ "--sw": p.swatch } as CSSProperties}
                aria-hidden="true"
              />
              {p.color}
              <span className="text-muted-foreground">·</span>
              <span className="tabular-nums">{formatPrice(p.price)}</span>
            </p>
            <p
              className="mt-6 leading-relaxed text-muted-foreground"
              data-reveal
              style={{ ["--d" as string]: "240ms" }}
            >
              {p.description}
            </p>

            {!p.available && (
              <p className="mt-4 text-sm text-wine">
                Esta pieza está agotada. Escríbeme y te hago una igual.
              </p>
            )}

            <div
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              data-reveal
              style={{ ["--d" as string]: "320ms" }}
            >
              <a
                href={p.vinted || VINTED_URL}
                target="_blank"
                rel="noopener"
                className="btn-solid flex-1"
              >
                Comprar en Vinted{" "}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" strokeWidth={1.5} />
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="btn-ghost flex-1">
                <Instagram className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={1.5} />
                Preguntar por Instagram
              </a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              ¿Lo quieres en otro color?{" "}
              <Link to="/pedidos" className="link-draw text-foreground">
                Encarga un modelo personalizado
              </Link>
              .
            </p>

            <dl className="mt-10" aria-label="Características">
              {specs.map(([k, v]) => (
                <div key={k} className="spec-row">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              <div className="spec-row border-b border-border" />
            </dl>

            <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
              <section aria-labelledby="pieza-detalles" className="space-y-2">
                <h2 id="pieza-detalles" className="font-display text-xl text-foreground">
                  Cómo está hecho
                </h2>
                <p>
                  {isBag ? "Bolso" : "Funda para portátil"} cortado y cosido a mano en Barcelona por
                  Marta Amarelo: {p.leather.toLowerCase()}, {p.fringe.toLowerCase()} cosidos fila a
                  fila
                  {/^sin\b/i.test(p.studs)
                    ? ", sin tachuelas"
                    : ` y ${p.studs.toLowerCase()} colocadas a mano sobre la solapa`}
                  .{" "}
                  {isBag
                    ? "Incluye correa. Cada bolso lleva de cuatro a cinco horas de trabajo y se hace en series muy cortas."
                    : "No lleva correa. Antes de comprar, escribe por Instagram con el modelo de tu portátil y Marta te confirma que cabe."}
                </p>
                <p>
                  Forma parte de los{" "}
                  <Link to={hub.path} className="link-draw text-foreground">
                    {hub.name.toLowerCase()}
                  </Link>{" "}
                  de By Maam.
                </p>
              </section>
              <section aria-labelledby="pieza-cuidados" className="space-y-2">
                <h2 id="pieza-cuidados" className="font-display text-xl text-foreground">
                  Cuidados
                </h2>
                <p>
                  Se limpia con un paño suave apenas húmedo. Si los flecos se enredan, sepáralos con
                  los dedos desde la punta. Guárdalo relleno de papel, lejos del sol directo.{" "}
                  <Link
                    to={guidePath("como-cuidar-un-bolso-con-flecos") as "/"}
                    className="link-draw text-foreground"
                  >
                    Guía completa de cuidados
                  </Link>
                  .
                </p>
              </section>
              <section aria-labelledby="pieza-envio" className="space-y-2">
                <h2 id="pieza-envio" className="font-display text-xl text-foreground">
                  Envío y devoluciones
                </h2>
                <p>
                  Envío con número de seguimiento: unos 5 días de preparación y 3-4 días de
                  transporte. Tienes 14 días para devolverlo si no te convence.{" "}
                  <Link to="/devoluciones" className="link-draw text-foreground">
                    Política de devoluciones
                  </Link>
                  .
                </p>
              </section>
            </div>

            <div className="mt-8">
              <ShareButtons title={`${p.name} · By Maam`} path={productPath(p.slug)} />
            </div>
          </div>
        </div>
      </article>

      <section className="border-t border-border bg-card section-y" aria-labelledby="mas-piezas">
        <div className="container-brand">
          <h2 id="mas-piezas" className="text-3xl md:text-5xl" data-reveal>
            Combina con
          </h2>
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <div key={r.slug} data-reveal style={{ ["--d" as string]: `${i * 100}ms` }}>
                <ProductTile
                  product={r}
                  sizes="(min-width: 1408px) 27rem, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                />
              </div>
            ))}
          </div>
          <p className="mt-12 text-sm">
            <Link to={hub.path} className="link-draw tap">
              Ver todos los {hub.name.toLowerCase()}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
