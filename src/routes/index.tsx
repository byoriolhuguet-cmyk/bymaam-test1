import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Instagram } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Wordmark } from "@/components/brand/Logo";
import { ColorDress, VintedOrb } from "@/components/site/ColorDress";
import { ScrollShowcase, useHomeChoreography } from "@/components/site/ScrollShowcase";
import { LitWords, Marquee, SplitHeading } from "@/components/site/Motion";
import { Newsletter } from "@/components/site/Newsletter";
import { BAGS, PRODUCTS, formatPrice, productSrcSet } from "@/data/products";
import { INSTAGRAM_PHOTOS } from "@/data/instagram";
import { seo } from "@/lib/seo";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, NEWSLETTER_ENDPOINT, SITE_URL, VINTED_URL } from "@/lib/site";

const TITLE = "Bolsos hechos a mano de piel con flecos | By Maam";
const DESC =
  "Bolsos hechos a mano de piel con flecos y tachuelas, cosidos por Marta Amarelo en Barcelona. Ediciones limitadas, correa incluida. Compra en Vinted.";

export const Route = createFileRoute("/")({
  head: () => {
    const base = seo({
      title: TITLE,
      description: DESC,
      path: "/",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/#home`,
        url: `${SITE_URL}/`,
        name: TITLE,
        description: DESC,
        inLanguage: "es-ES",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: PRODUCTS.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/coleccion/${p.slug}`,
            name: p.name,
          })),
        },
      },
    });
    const first = BAGS[0]!;
    return {
      ...base,
      links: [
        ...base.links,
        {
          rel: "preload",
          as: "image",
          href: first.image,
          imageSrcSet: productSrcSet(first),
          imageSizes: "(min-width: 1024px) 46vw, 92vw",
          fetchPriority: "high",
        },
      ],
    };
  },
  component: Index,
});

const STATS = [
  { value: "4–5 h", label: "de trabajo en cada bolso" },
  { value: "1 mesa", label: "donde se corta, se cose y se remacha" },
  { value: "100 %", label: "hecho a mano, con correa incluida" },
];

const MATERIALS = [
  { src: "/images/materials/piel.webp", title: "Piel", text: "Con textura, cortada y cosida a mano.", alt: "Detalle de la piel marrón chocolate de un bolso By Maam con tachuelas doradas" },
  { src: "/images/materials/flecos.webp", title: "Flecos", text: "Largos, densos y con mucho movimiento.", alt: "Detalle de los flecos camel de un bolso hecho a mano By Maam" },
  { src: "/images/materials/tachuelas.webp", title: "Tachuelas", text: "Doradas, bronce o plateadas, según el modelo.", alt: "Detalle de las tachuelas plateadas sobre piel blanca de una funda By Maam" },
  { src: "/images/materials/textura.webp", title: "Color", text: "Tonos de edición limitada: camel, violeta, gris, chocolate.", alt: "Detalle de la piel violeta texturizada y los flecos grises del bolso Cassis" },
];

const STEPS = [
  { title: "Elige tu pieza", text: "Mira la colección y quédate con la que más te guste. Cada modelo existe en series muy cortas." },
  { title: "Cómprala", text: "En Vinted, con compra protegida. Si prefieres reservarla o pedir otro color, escríbeme por Instagram." },
  { title: "Recíbela en casa", text: "Marta la prepara a mano y te la envía con número de seguimiento." },
];

const REVIEWS = [
  "Es un bolso precioso y de muy buena calidad.",
  "Un bolsito precioso! Y la vendedora muy amable y rápida.",
  "El bolso es precioso, y la chica súper maja!!",
];


/** Portada: bolso grande centrado que cambia solo (fundido), como el bodegón de Miu Miu. */
function HeroStage() {
  const [active, setActive] = useState(0);
  // Solo se descargan la foto visible y la siguiente (en móvil, 1 foto en vez de 6 al cargar)
  const [reach, setReach] = useState(0);
  useEffect(() => {
    // La siguiente foto se pide cuando la primera ya está pintada (no compite con el LCP)
    const id = window.setTimeout(() => setReach((r) => Math.max(r, active + 1)), active === 0 ? 2500 : 0);
    return () => window.clearTimeout(id);
  }, [active]);
  const paused = useRef(false);
  const count = BAGS.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (paused.current || document.hidden) return;
      setActive((current) => (current + 1) % count);
    }, 4200);
    return () => window.clearInterval(id);
  }, [count]);

  const current = BAGS[active]!;

  return (
    <div
      className="miu-hero-stage"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
    >
      <div className="miu-hero-media">
        {BAGS.map((p, i) =>
          i === active || i <= reach ? (
            <img
              key={p.slug}
              className={i === active ? "is-active" : undefined}
              aria-hidden={i !== active}
              src={p.image}
              srcSet={productSrcSet(p)}
              sizes="(min-width: 1024px) 52vw, 92vw"
              alt={i === active ? p.alt : ""}
              width={p.w}
              height={p.h}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding="async"
            />
          ) : null,
        )}
      </div>
      <p className="miu-sub" aria-live="polite">
        <Link to="/coleccion/$slug" params={{ slug: current.slug }}>
          {current.name} · {current.color} · {formatPrice(current.price)}
        </Link>
      </p>
    </div>
  );
}

/** Contador de paneles "1 / 6" (lo actualiza useHomeChoreography). */
function PanelCounter({ total }: { total: number }) {
  return (
    <p className="miu-counter" aria-hidden="true">
      <span data-panel-current>1</span> / {total}
    </p>
  );
}

const PANELS = 6;

function Index() {
  const rootRef = useRef<HTMLDivElement>(null);
  useHomeChoreography(rootRef);

  return (
    <div ref={rootRef} className="miu">
      {/* PANEL 1 · PORTADA (logo gigante que se encoge hasta la cabecera) */}
      <section className="miu-panel miu-hero hero-home" data-panel aria-labelledby="hero-title">
        <div className="miu-logo" data-hero-logo aria-hidden="true">
          <Wordmark size={30} />
        </div>
        <HeroStage />
        <div className="miu-caption hero-fade" style={{ ["--i" as string]: 1 }}>
          <h1 id="hero-title" className="miu-title">Bolsos hechos a mano</h1>
          <p className="miu-sub">Edición limitada · Cosidos uno a uno en Barcelona</p>
          <div className="miu-links">
            <a href={VINTED_URL} target="_blank" rel="noopener" className="miu-link">Comprar en Vinted</a>
            <Link to="/coleccion" className="miu-link">Ver la colección</Link>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="miu-link">Instagram</a>
          </div>
        </div>
        <p className="miu-scroll" aria-hidden="true">Desplázate para explorar</p>
      </section>

      {/* PANEL 2 · COLECCIÓN (fila de piezas) */}
      <ScrollShowcase products={BAGS} />

      {/* PANEL 3 · MARTA (foto a sangre) */}
      <section className="miu-panel miu-photo" data-panel aria-labelledby="historia">
        <img
          src="/images/brand/marta-amarelo.webp"
          srcSet="/images/brand/marta-amarelo-700.webp 700w, /images/brand/marta-amarelo.webp 1400w"
          sizes="100vw"
          alt="Marta Amarelo, fundadora de By Maam"
          width={1400}
          height={1375}
          loading="lazy"
          decoding="async"
        />
        <div className="miu-caption miu-caption--light">
          <h2 id="historia" className="miu-title">No es una fábrica. Es Marta.</h2>
          <p className="miu-sub">21 años, de Galicia, cose cada bolso en Barcelona</p>
          <div className="miu-links">
            <Link to="/sobre-mi" className="miu-link">Conocer a Marta</Link>
          </div>
        </div>
      </section>

      {/* PANEL 4 · DETALLES (fila de materiales) */}
      <section className="miu-panel miu-look" data-panel aria-labelledby="materiales">
        <h2 id="materiales" className="miu-title miu-look-title">Los detalles que definen cada pieza</h2>
        <ul className="miu-row miu-row--4">
          {MATERIALS.map((m) => (
            <li key={m.title} className="miu-tile">
              <div className="miu-tile-media miu-tile-media--cover">
                <img src={m.src} alt={m.alt} width={800} height={1000} loading="lazy" decoding="async" />
              </div>
              <p className="miu-tile-label">{m.title}</p>
              <p className="miu-tile-note">{m.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* PANEL 5 · TU COLOR */}
      <ColorDress />

      {/* PANEL 6 · AVISOS / NEWSLETTER + botón Vinted */}
      <section className="miu-panel wine-band section-y" data-panel aria-labelledby="avisos">
        <div className="container-brand relative z-10 max-w-3xl text-center">
          <p className="eyebrow" data-reveal>Ediciones limitadas</p>
          {NEWSLETTER_ENDPOINT ? (
            <>
              <SplitHeading id="avisos" lines={["Suscríbete y recibe", "un 10% en tu primer pedido"]} className="mt-5 text-4xl leading-[1.04] md:text-6xl" />
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed opacity-80">
                Te aviso cuando saco una edición nueva. Suelen durar días, no semanas.
              </p>
              <div className="mt-9 flex justify-center"><Newsletter /></div>
              <div className="mt-10 flex justify-center"><VintedOrb /></div>
            </>
          ) : (
            <>
              <SplitHeading id="avisos" lines={["Las piezas duran días,", "no semanas"]} className="mt-5 text-4xl leading-[1.04] md:text-6xl" />
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed opacity-80" data-reveal>
                Cada edición nueva se anuncia primero en Instagram. Síguela para no perderte ninguna.
              </p>
              <div className="mt-10 flex justify-center">
                <VintedOrb />
              </div>
              <div className="mt-10" data-reveal style={{ ["--d" as string]: "200ms" }}>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="btn-cream" data-magnetic>
                  <Instagram className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={1.5} />
                  Seguir {INSTAGRAM_HANDLE}
                </a>
              </div>
            </>
          )}
        </div>
      </section>


      <PanelCounter total={PANELS} />

      {/* Después de los paneles: el resto de la portada con scroll normal */}
      <div className="miu-after">
        {/* TITULAR ELÁSTICO (se ensancha y gana peso con el scroll) */}
        <section className="stretch-band" aria-label="Hecho a mano, pieza a pieza">
          <p className="stretch-type" data-stretch>
            <span className="stretch-line">Hecho</span>
            <span className="stretch-line stretch-line--alt"><em>a mano,</em></span>
            <span className="stretch-line">pieza a pieza</span>
          </p>
        </section>

        {/* MANIFIESTO */}
        <section className="section-y" aria-labelledby="manifiesto">
          <div className="container-brand grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow" data-reveal>Hecho a mano de verdad</p>
              <h2 id="manifiesto" className="sr-only">Cómo se hace un bolso de By Maam</h2>
              <LitWords
                className="statement mt-6"
                text="Cada bolso lleva de cuatro a cinco horas de trabajo. Patrón, corte, costura y tachuelas salen de la misma mesa, en Barcelona."
              />
            </div>
            <dl className="grid gap-8 sm:grid-cols-3 lg:grid-cols-1">
              {STATS.map((s, i) => (
                <div key={s.value} data-reveal style={{ ["--d" as string]: `${i * 120}ms` }} className="border-t border-border pt-5">
                  <dt className="stat-num">{s.value}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

      {/* CÓMO COMPRAR */}
      <section className="section-y" aria-labelledby="como-comprar">
        <div className="container-brand">
          <p className="eyebrow" data-reveal>Cómo comprar</p>
          <SplitHeading id="como-comprar" lines={["Tres pasos,", <em key="e" className="text-wine">sin complicaciones</em>]} className="mt-4 text-4xl leading-[1.02] md:text-6xl" />
          <ol className="steps-stack mt-14">
            {STEPS.map((s, i) => (
              <li key={s.title} className="step-card" style={{ ["--i" as string]: i }}>
                <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-2xl md:text-4xl">{s.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap gap-3" data-reveal>
            <a href={VINTED_URL} target="_blank" rel="noopener" className="btn-solid" data-magnetic>
              Comprar en Vinted <ArrowUpRight className="h-4 w-4" aria-hidden="true" strokeWidth={1.5} />
            </a>
            <Link to="/pedidos" className="btn-ghost">Pedir un modelo personalizado</Link>
          </div>
        </div>
      </section>


      {/* RESEÑAS */}
      <section className="cv-auto border-y border-border bg-card section-y" aria-labelledby="resenas">
        <div className="container-brand">
          <p className="eyebrow" data-reveal>Lo que dicen</p>
          <SplitHeading id="resenas" lines={["Quien lo lleva,", <em key="e" className="text-wine">repite</em>]} className="mt-4 text-4xl leading-[1.02] md:text-6xl" />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {REVIEWS.map((text, i) => (
              <blockquote key={text} data-reveal style={{ ["--d" as string]: `${i * 120}ms` }} className="border-t border-border pt-6">
                <p className="sr-only">Valoración: 5 de 5 estrellas</p>
                <div className="mb-4 flex gap-1 text-wine" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <span key={s} className="text-lg leading-none">★</span>
                  ))}
                </div>
                <p className="font-display text-2xl leading-snug">{text}</p>
                <footer className="mt-5 text-xs uppercase tracking-[0.18em] text-clay">Reseña de Vinted</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>


      {/* INSTAGRAM */}
      <section className="cv-auto relative overflow-hidden bg-background py-6 md:py-10" aria-label="Instagram de By Maam">
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="block" aria-label={`Abrir Instagram ${INSTAGRAM_HANDLE}`}>
          <Marquee className="marquee-xl" items={[INSTAGRAM_HANDLE, "bolsos hechos a mano", INSTAGRAM_HANDLE, "edición limitada"]} />
        </a>
        {INSTAGRAM_PHOTOS.length > 0 && (
          <div className="container-brand mt-10">
            <div className="ig-grid">
              {INSTAGRAM_PHOTOS.map((photo, i) => (
                <a key={photo.src} href={INSTAGRAM_URL} target="_blank" rel="noopener" data-reveal="clip" style={{ ["--d" as string]: `${i * 90}ms` }} aria-label={`${photo.alt}. Ver en Instagram`}>
                  <img src={photo.src} alt={photo.alt} width={800} height={800} loading="lazy" decoding="async" />
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
      </div>
    </div>
  );
}
