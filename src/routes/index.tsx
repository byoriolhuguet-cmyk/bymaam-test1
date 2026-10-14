import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Instagram } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CollectionRail } from "@/components/site/CollectionRail";
import { LitWords, Marquee, SplitHeading } from "@/components/site/Motion";
import { ColorDress } from "@/components/site/ColorDress";
import { Newsletter } from "@/components/site/Newsletter";
import { BAGS, PRODUCTS, formatPrice, productSrcSet } from "@/data/products";
import { INSTAGRAM_PHOTOS } from "@/data/instagram";
import { seo } from "@/lib/seo";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, NEWSLETTER_ENDPOINT, SITE_URL, VINTED_URL } from "@/lib/site";

const TITLE = "Bolsos hechos a mano de piel con flecos | By Maam";
const DESC =
  "Bolsos hechos a mano de piel con flecos y tachuelas, cosidos por Marta Amarelo en Galicia. Ediciones limitadas, correa incluida. Compra en Vinted.";

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

const MARQUEE = ["Hecho a mano", "Edición limitada", "Piel real", "Flecos y tachuelas", "Envío con seguimiento", "Galicia, España"];

const STATS = [
  { value: "4–5 h", label: "de trabajo en cada bolso" },
  { value: "1 mesa", label: "donde se corta, se cose y se remacha" },
  { value: "100 %", label: "piel real, con correa incluida" },
];

const MATERIALS = [
  { src: "/images/materials/piel.webp", title: "Piel", text: "Grano natural, cortada y cosida a mano.", alt: "Detalle de la piel marrón chocolate de un bolso By Maam con tachuelas doradas" },
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

function HeroStage() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [cycled, setCycled] = useState(false);
  // Solo se descargan la diapositiva visible y la siguiente, y la siguiente cuando la primera ya está pintada
  const [reach, setReach] = useState(0);
  useEffect(() => {
    const id = window.setTimeout(() => setReach((r) => Math.max(r, active + 1)), active === 0 ? 2500 : 0);
    return () => window.clearTimeout(id);
  }, [active]);
  const paused = useRef(false);
  const count = BAGS.length;

  const go = (next: number) => {
    setActive((current) => {
      if (current === next) return current;
      setPrev(current);
      return next;
    });
    setCycled(true);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (paused.current || document.hidden) return;
      setActive((current) => {
        setPrev(current);
        return (current + 1) % count;
      });
      setCycled(true);
    }, 4200);
    return () => window.clearInterval(id);
  }, [count]);

  const current = BAGS[active]!;

  return (
    <div
      className="hero-stage"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
    >
      <div className="hero-frame">
      <div className="hero-badge" aria-hidden="true">
        <span>
          Edición
          <br />
          limitada
        </span>
      </div>
      <div className="hero-card" data-cycled={cycled}>
        {BAGS.map((p, i) => (
          <div key={p.slug} className={`hero-slide ${i === active ? "is-active" : i === prev ? "is-prev" : ""}`} aria-hidden={i !== active}>
            {(i === active || i === prev || i <= reach) && (
            <img
              src={p.image}
              srcSet={productSrcSet(p)}
              sizes="(min-width: 1024px) 46vw, 92vw"
              alt={p.alt}
              width={p.w}
              height={p.h}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding="async"
              style={{ objectPosition: p.pos }}
            />
            )}
          </div>
        ))}
      </div>
      </div>
      <div className="hero-meta">
        <Link to="/coleccion/$slug" params={{ slug: current.slug }} className="link-draw" aria-live="polite">
          {current.name} · {current.color} · {formatPrice(current.price)} →
        </Link>
        <div className="hero-dots" role="group" aria-label="Elegir bolso">
          {BAGS.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              className="hero-dot"
              aria-label={`Ver ${p.name}`}
              aria-current={i === active}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Index() {
  return (
    <>
      {/* PORTADA */}
      <section className="hero-home" aria-labelledby="hero-title">
        <div className="container-brand hero-grid">
          <div>
            <p className="eyebrow hero-fade" style={{ ["--i" as string]: 0 }}>Handmade · Galicia · Edición limitada</p>
            <h1 id="hero-title" className="hero-title">
              <span className="split-line hero-line"><span style={{ ["--i" as string]: 0 }}>Bolsos</span></span>{" "}
              <span className="split-line hero-line"><span style={{ ["--i" as string]: 1 }}>hechos</span></span>{" "}
              <span className="split-line hero-line"><span style={{ ["--i" as string]: 2 }}><em>a mano</em></span></span>
            </h1>
            <p className="hero-lead hero-fade" style={{ ["--i" as string]: 2 }}>
              Bolsos y fundas de piel con flecos y tachuelas, cosidos uno a uno por Marta Amarelo. Series cortas, correa incluida.
            </p>
            <div className="hero-actions hero-fade" style={{ ["--i" as string]: 3 }}>
              <Link to="/coleccion" className="btn-solid">Ver la colección</Link>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="btn-ghost">
                <Instagram className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={1.5} />
                Pedir por Instagram
              </a>
            </div>
          </div>
          <HeroStage />
        </div>
        <div className="hero-scroll" aria-hidden="true">
          Scroll
          <i />
        </div>
      </section>

      <Marquee items={MARQUEE} />

      {/* MANIFIESTO */}
      <section className="section-y" aria-labelledby="manifiesto">
        <div className="container-brand grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow" data-reveal>Hecho a mano de verdad</p>
            <h2 id="manifiesto" className="sr-only">Cómo se hace un bolso de By Maam</h2>
            <LitWords
              className="statement mt-6"
              text="Cada bolso lleva de cuatro a cinco horas de trabajo. Patrón, corte, costura y tachuelas salen de la misma mesa, en Galicia."
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

      {/* COLECCIÓN (carril horizontal) */}
      <CollectionRail products={BAGS} />

      {/* MATERIALES */}
      <section className="section-y" aria-labelledby="materiales">
        <div className="container-brand">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow" data-reveal>Los detalles</p>
              <SplitHeading id="materiales" lines={["Piel, flecos", <em key="e" className="text-wine">y tachuelas</em>]} className="mt-4 text-4xl leading-[1.02] md:text-6xl" />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground" data-reveal>
              Tres ingredientes, mil combinaciones. Cada modelo mezcla piel, flecos y herrajes de forma distinta.
            </p>
          </div>
          <div className="material-grid mt-14">
            {MATERIALS.map((m, i) => (
              <article key={m.title} className="material" style={{ ["--d" as string]: `${i * 110}ms` }}>
                <div className="material-media" data-reveal="clip" style={{ ["--d" as string]: `${i * 110}ms` }}>
                  <img
                    src={m.src}
                    srcSet={`${m.src.replace(/\.webp$/, "-480.webp")} 480w, ${m.src} 800w`}
                    sizes="(min-width: 1408px) 20rem, (min-width: 1024px) 23vw, 46vw"
                    alt={m.alt}
                    width={800}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h3 className="mt-4 font-display text-2xl">{m.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MARTA */}
      <section className="story section-y" aria-labelledby="historia">
        <div className="container-brand grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="story-photo" data-reveal="clip">
            <div className="story-parallax" data-parallax="0.07">
            <img
              src="/images/brand/marta-amarelo.webp"
              srcSet="/images/brand/marta-amarelo-700.webp 700w, /images/brand/marta-amarelo.webp 1400w"
              sizes="(min-width: 1024px) 40vw, 92vw"
              alt="Marta Amarelo, fundadora de By Maam"
              width={1400}
              height={1375}
              loading="lazy"
              decoding="async"
            />
            </div>
          </div>
          <div>
            <p className="eyebrow" data-reveal>Sobre Marta</p>
            <SplitHeading
              id="historia"
              lines={["No es una fábrica.", <em key="e">Es una persona</em>, "y una mesa de trabajo."]}
              className="mt-5 text-4xl leading-[1.04] md:text-6xl"
            />
            <p className="mt-8 max-w-md leading-relaxed opacity-80" data-reveal style={{ ["--d" as string]: "250ms" }}>
              By Maam nació de las manos de Marta Amarelo, una chica de 21 años que estudia medicina. Su curiosidad por la moda y su pasión por el trabajo manual la llevaron a crear una marca donde cada bolso es único, cosido pieza a pieza.
            </p>
            <div className="mt-9" data-reveal style={{ ["--d" as string]: "350ms" }}>
              <Link to="/sobre-mi" className="btn-cream">Conocer a Marta</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO COMPRAR */}
      <section className="section-y" aria-labelledby="como-comprar">
        <div className="container-brand">
          <p className="eyebrow" data-reveal>Cómo comprar</p>
          <SplitHeading id="como-comprar" lines={["Tres pasos,", <em key="e" className="text-wine">sin complicaciones</em>]} className="mt-4 text-4xl leading-[1.02] md:text-6xl" />
          <ol className="mt-14 grid gap-10 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} data-reveal style={{ ["--d" as string]: `${i * 120}ms` }} className="border-t border-foreground/80 pt-5">
                <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-2xl">{s.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap gap-3" data-reveal>
            <a href={VINTED_URL} target="_blank" rel="noopener" className="btn-solid">
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

      {/* TU COLOR: la web adopta la paleta del bolso elegido */}
      <ColorDress />

      {/* AVISOS / NEWSLETTER */}
      <section className="wine-band section-y" aria-labelledby="avisos">
        <div className="container-brand relative z-10 max-w-3xl text-center">
          <p className="eyebrow" data-reveal>Ediciones limitadas</p>
          {NEWSLETTER_ENDPOINT ? (
            <>
              <SplitHeading id="avisos" lines={["Suscríbete y recibe", "un 10% en tu primer pedido"]} className="mt-5 text-4xl leading-[1.04] md:text-6xl" />
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed opacity-80">
                Te aviso cuando saco una edición nueva. Suelen durar días, no semanas.
              </p>
              <div className="mt-9 flex justify-center"><Newsletter /></div>
            </>
          ) : (
            <>
              <SplitHeading id="avisos" lines={["Las piezas duran días,", "no semanas"]} className="mt-5 text-4xl leading-[1.04] md:text-6xl" />
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed opacity-80" data-reveal>
                Cada edición nueva se anuncia primero en Instagram. Síguela para no perderte ninguna.
              </p>
              <div className="mt-9" data-reveal style={{ ["--d" as string]: "200ms" }}>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="btn-cream">
                  <Instagram className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={1.5} />
                  Seguir {INSTAGRAM_HANDLE}
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="cv-auto overflow-hidden py-14 md:py-20" aria-label="Instagram de By Maam">
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="block">
          <span className="sr-only">Abrir Instagram {INSTAGRAM_HANDLE}</span>
          <div aria-hidden="true">
            <Marquee className="marquee-xl" items={[INSTAGRAM_HANDLE, "bolsos hechos a mano", INSTAGRAM_HANDLE, "edición limitada"]} />
          </div>
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
    </>
  );
}
