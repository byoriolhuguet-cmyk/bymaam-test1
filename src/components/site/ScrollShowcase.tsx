import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type RefObject } from "react";

import { ProductTile } from "@/components/site/ProductTile";
import { SplitHeading } from "@/components/site/Motion";
import type { Product } from "@/data/products";

const REDUCED = "(prefers-reduced-motion: reduce)";
/** El carril solo se fija al scroll en pantallas medianas o grandes; en móvil es un carril nativo con snap. */
const PIN = "(min-width: 768px)";
const FINE = "(hover: hover) and (pointer: fine)";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/** Vuelve a ejecutar los efectos cuando cambian las preferencias de movimiento o el tamaño de pantalla. */
function useMediaKey(queries: string[]) {
  const [key, setKey] = useState("");
  useEffect(() => {
    const lists = queries.map((q) => window.matchMedia(q));
    const read = () => setKey(lists.map((l) => (l.matches ? "1" : "0")).join(""));
    read();
    lists.forEach((l) => l.addEventListener("change", read));
    return () => lists.forEach((l) => l.removeEventListener("change", read));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return key;
}

/**
 * Carril horizontal de la colección. Con movimiento permitido y pantalla ≥ 768 px se "fija" y
 * el scroll vertical desplaza las piezas; con movimiento reducido, en móvil o sin JS es un
 * carril con scroll horizontal nativo y snap (totalmente accesible, sin secuestrar el scroll).
 */
export function ScrollShowcase({ products }: { products: Product[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const media = useMediaKey([REDUCED, PIN]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || !media) return;
    if (window.matchMedia(REDUCED).matches || !window.matchMedia(PIN).matches) return;

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
      const p = range > 0 ? clamp(-top / range) : 0;
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
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      delete section.dataset["pinned"];
      section.style.removeProperty("height");
      section.style.removeProperty("--travel");
      section.style.removeProperty("--p");
      setIndex(0);
    };
  }, [products.length, media]);

  const total = String(products.length).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      className="rail"
      aria-labelledby="rail-title"
      id="coleccion-destacada"
    >
      <div className="rail-stage">
        <div className="container-brand flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow" data-reveal>
              La colección
            </p>
            <SplitHeading
              id="rail-title"
              lines={[
                "Piezas disponibles",
                <em key="e" className="text-wine">
                  ahora mismo
                </em>,
              ]}
              className="mt-4 text-4xl leading-[1.02] md:text-6xl"
            />
          </div>
          <div className="flex items-center gap-6">
            <span
              className="hidden text-sm tabular-nums text-muted-foreground sm:block"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")} / {total}
            </span>
            <Link to="/coleccion" className="btn-ghost btn-sm">
              Ver toda la colección
            </Link>
          </div>
        </div>

        <div className="rail-viewport" tabIndex={-1}>
          <div ref={trackRef} className="rail-track">
            {products.map((product, i) => (
              <div key={product.slug} className="rail-tile">
                <ProductTile
                  product={product}
                  priority={i === 0}
                  sizes="(min-width: 1024px) 34vw, 82vw"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="rail-progress" aria-hidden="true" />
      </div>
    </section>
  );
}

/**
 * Movimiento de la portada por debajo del hero. Solo se monta en "/", solo con `html.motion-ok`
 * (JS y sin prefers-reduced-motion) y se reinicia (limpiando estilos) si cambian las preferencias.
 *
 *  - [data-stretch]: titular gigante que se ensancha y gana peso con el scroll (--p 0..1).
 *  - .marquee dentro de la portada: se inclina según la velocidad del scroll (--skew).
 *  - Solo con ratón: cursor "Ver" sobre [data-cursor], zoom que sigue al puntero en las fotos
 *    de producto y botones magnéticos [data-magnetic].
 *
 * Un único listener de scroll pasivo, una rAF por frame y solo sobre elementos visibles.
 */
export function useHomeChoreography(rootRef: RefObject<HTMLElement | null>) {
  const media = useMediaKey([REDUCED, FINE]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !media) return;
    if (
      !document.documentElement.classList.contains("motion-ok") ||
      window.matchMedia(REDUCED).matches
    )
      return;

    const fine = window.matchMedia(FINE).matches;
    const cleanups: (() => void)[] = [];
    const stretch = Array.from(root.querySelectorAll<HTMLElement>("[data-stretch]"));
    const marquees = Array.from(root.querySelectorAll<HTMLElement>(".marquee"));
    const live = new Set<HTMLElement>();

    // ——— Scroll: titulares elásticos + inclinación de las cintas según la velocidad
    let frame = 0;
    let lastY = window.scrollY;
    let skew = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      live.forEach((el) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty(
          "--p",
          clamp((vh - rect.top) / (vh * 0.7 + rect.height * 0.3)).toFixed(4),
        );
      });
      const y = window.scrollY;
      const target = clamp((y - lastY) * 0.12, -7, 7);
      lastY = y;
      skew += (target - skew) * 0.18;
      if (Math.abs(skew) < 0.02) skew = 0;
      marquees.forEach((m) => m.style.setProperty("--skew", `${skew.toFixed(2)}deg`));
      if (skew !== 0) schedule();
    };
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    const watch = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.isIntersecting
            ? live.add(e.target as HTMLElement)
            : live.delete(e.target as HTMLElement),
        );
        schedule();
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    stretch.forEach((el) => watch.observe(el));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();
    cleanups.push(() => {
      cancelAnimationFrame(frame);
      watch.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      stretch.forEach((el) => el.style.removeProperty("--p"));
      marquees.forEach((m) => m.style.removeProperty("--skew"));
    });

    // ——— Solo con ratón: cursor, zoom de producto y botones magnéticos
    if (fine) {
      const cursor = document.createElement("div");
      cursor.className = "choreo-cursor";
      cursor.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      cursor.appendChild(label);
      document.body.appendChild(cursor);

      let cx = -100;
      let cy = -100;
      let tx = -100;
      let ty = -100;
      let cursorFrame = 0;
      const follow = () => {
        cursorFrame = 0;
        cx += (tx - cx) * 0.22;
        cy += (ty - cy) * 0.22;
        cursor.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
        if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3)
          cursorFrame = requestAnimationFrame(follow);
      };

      let magnet: HTMLElement | null = null;
      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        tx = event.clientX;
        ty = event.clientY;
        if (!cursorFrame) cursorFrame = requestAnimationFrame(follow);

        const target = event.target instanceof Element ? event.target : null;
        const host = target?.closest<HTMLElement>("[data-cursor]");
        cursor.classList.toggle("is-on", !!host && root.contains(host));
        if (host) label.textContent = host.dataset["cursor"] ?? "";

        const media = target?.closest<HTMLElement>(".tile-media");
        if (media && root.contains(media)) {
          const r = media.getBoundingClientRect();
          media.style.setProperty(
            "--ox",
            `${(((event.clientX - r.left) / r.width) * 100).toFixed(1)}%`,
          );
          media.style.setProperty(
            "--oy",
            `${(((event.clientY - r.top) / r.height) * 100).toFixed(1)}%`,
          );
        }

        const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
        if (magnet && magnet !== m) magnet.style.removeProperty("translate");
        magnet = m && root.contains(m) ? m : null;
        if (magnet) {
          const r = magnet.getBoundingClientRect();
          const dx = (event.clientX - (r.left + r.width / 2)) * 0.28;
          const dy = (event.clientY - (r.top + r.height / 2)) * 0.36;
          magnet.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
        }
      };
      const onLeave = () => cursor.classList.remove("is-on");
      root.classList.add("choreo-fine");
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        cancelAnimationFrame(cursorFrame);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
        root.classList.remove("choreo-fine");
        cursor.remove();
        magnet?.style.removeProperty("translate");
        root.querySelectorAll<HTMLElement>(".tile-media").forEach((el) => {
          el.style.removeProperty("--ox");
          el.style.removeProperty("--oy");
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [rootRef, media]);
}
