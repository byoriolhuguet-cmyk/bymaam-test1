import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { ProductTile } from "@/components/site/ProductTile";
import { SplitHeading } from "@/components/site/Motion";
import type { Product } from "@/data/products";

/**
 * Carril horizontal de la colección. Con JS y movimiento permitido se "fija" y el
 * scroll vertical desplaza las piezas; sin JS o con movimiento reducido es un
 * carril con scroll horizontal nativo y snap (totalmente accesible).
 */
export function CollectionRail({ products }: { products: Product[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let frame = 0;
    const measure = () => {
      const viewport = track.parentElement as HTMLElement;
      const pad = parseFloat(getComputedStyle(viewport).paddingLeft) * 2;
      const travel = Math.max(0, track.scrollWidth - (window.innerWidth - pad));
      section.style.setProperty("--travel", `${travel}px`);
      section.style.height = `${window.innerHeight + travel}px`;
    };
    const update = () => {
      frame = 0;
      const range = section.offsetHeight - window.innerHeight;
      const top = section.getBoundingClientRect().top;
      const p = range > 0 ? Math.min(1, Math.max(0, -top / range)) : 0;
      section.style.setProperty("--p", p.toFixed(4));
      const i = Math.round(p * (products.length - 1));
      setIndex((prev) => (prev === i ? prev : i));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      schedule();
    };

    section.dataset["pinned"] = "true";
    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      delete section.dataset["pinned"];
      section.style.removeProperty("height");
      section.style.removeProperty("--travel");
      section.style.removeProperty("--p");
    };
  }, [products.length]);

  const total = String(products.length).padStart(2, "0");

  return (
    <section ref={sectionRef} className="rail" aria-labelledby="rail-title" id="coleccion-destacada">
      <div className="rail-stage">
        <div className="container-brand flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow" data-reveal>La colección</p>
            <SplitHeading
              id="rail-title"
              lines={["Piezas disponibles", <em key="e" className="text-wine">ahora mismo</em>]}
              className="mt-4 text-4xl leading-[1.02] md:text-6xl"
            />
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden text-sm tabular-nums text-muted-foreground sm:block" aria-hidden="true">
              {String(index + 1).padStart(2, "0")} / {total}
            </span>
            <Link to="/coleccion" className="btn-ghost btn-sm">Ver toda la colección</Link>
          </div>
        </div>

        <div className="rail-viewport" tabIndex={-1}>
          <div ref={trackRef} className="rail-track">
            {products.map((product, i) => (
              <div key={product.slug} className="rail-tile">
                <ProductTile product={product} priority={i === 0} sizes="(min-width: 1360px) 34rem, (min-width: 680px) 40vw, 17rem" />
              </div>
            ))}
          </div>
        </div>
        <div className="rail-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
