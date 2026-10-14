import { Link } from "@tanstack/react-router";
import { useEffect, useState, type RefObject } from "react";

import { formatPrice, productSrcSet, type Product } from "@/data/products";
import { INSTAGRAM_URL, VINTED_URL } from "@/lib/site";

const REDUCED = "(prefers-reduced-motion: reduce)";
const FINE = "(hover: hover) and (pointer: fine)";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Vuelve a ejecutar los efectos cuando cambian las preferencias de movimiento o el tipo de puntero. */
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
 * Panel "Las piezas que definen la colección" (estilo Miu Miu): fila de fotos a sangre con el
 * nombre debajo y enlaces subrayados. Es un carril con scroll horizontal nativo y snap: nunca se
 * fija ni secuestra el scroll, así que funciona igual con movimiento reducido o sin JS.
 */
export function ScrollShowcase({ products }: { products: Product[] }) {
  return (
    <section
      className="miu-panel miu-look"
      data-panel
      aria-labelledby="rail-title"
      id="coleccion-destacada"
    >
      <h2 id="rail-title" className="miu-title miu-look-title">
        Las piezas que definen la colección
      </h2>
      <ul className="miu-row" aria-label="Bolsos disponibles">
        {products.map((p) => (
          <li key={p.slug} className="miu-tile">
            <Link
              to="/coleccion/$slug"
              params={{ slug: p.slug }}
              className="miu-tile-media"
              data-cursor="Ver"
            >
              <img
                src={p.image}
                srcSet={productSrcSet(p)}
                sizes="(min-width: 1024px) 25vw, 70vw"
                alt={p.alt}
                width={p.w}
                height={p.h}
                loading="lazy"
                decoding="async"
              />
              {!p.available && <span className="tile-sold">Agotado</span>}
            </Link>
            <p className="miu-tile-label">{p.name.replace(/^Bolso /, "")}</p>
            <p className="miu-tile-note">
              {p.color} · {formatPrice(p.price)}
            </p>
            <div className="miu-links miu-links--tight">
              <a
                href={p.vinted || VINTED_URL}
                target="_blank"
                rel="noopener"
                className="miu-link"
                aria-label={`Comprar en Vinted: ${p.name}`}
              >
                Comprar en Vinted
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener"
                className="miu-link"
                aria-label={`Instagram: preguntar por ${p.name}`}
              >
                Instagram
              </a>
            </div>
          </li>
        ))}
      </ul>
      <div className="miu-links">
        <Link to="/coleccion" className="miu-link">
          Ver toda la colección
        </Link>
      </div>
    </section>
  );
}

/**
 * Coreografía de la portada (solo se monta en "/"). Se reinicia, limpiando estilos, si cambian
 * las preferencias de movimiento o el tipo de puntero.
 *
 * Siempre (también con movimiento reducido):
 *  - Contador "n / 6" de los paneles [data-panel].
 *  - html[data-logo-docked]: la cabecera muestra su logo cuando el logo gigante de la portada ya no se ve.
 *
 * Solo con `html.motion-ok` y sin prefers-reduced-motion:
 *  - Logo gigante [data-hero-logo] que se encoge y sube hasta la cabecera (estilo Miu Miu).
 *  - Paneles a pantalla completa que se apilan: cada uno sube por encima del anterior (sticky, sin
 *    secuestrar el scroll). Un panel más alto que la pantalla se fija por abajo para verse entero.
 *  - [data-stretch]: titular gigante que se ensancha y gana peso con el scroll (--p 0..1).
 *  - .marquee: se inclina según la velocidad del scroll (--skew).
 *  - Solo con ratón: cursor "Ver" sobre [data-cursor], zoom que sigue al puntero en las fotos
 *    de producto y botones magnéticos [data-magnetic].
 *
 * Un único listener de scroll pasivo y una rAF por frame.
 */
export function useHomeChoreography(rootRef: RefObject<HTMLElement | null>) {
  const media = useMediaKey([REDUCED, FINE]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !media) return;
    const html = document.documentElement;
    const motion = html.classList.contains("motion-ok") && !window.matchMedia(REDUCED).matches;
    const fine = window.matchMedia(FINE).matches;
    const cleanups: (() => void)[] = [];

    const heroLogo = root.querySelector<HTMLElement>("[data-hero-logo]");
    const headerLogo = document.querySelector<HTMLElement>(".site-header .wordmark");
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-panel]"));
    const after = root.querySelector<HTMLElement>(".miu-after");
    const counter = root.querySelector<HTMLElement>(".miu-counter");
    const counterNum = counter?.querySelector<HTMLElement>("[data-panel-current]") ?? null;
    const stretch = Array.from(root.querySelectorAll<HTMLElement>("[data-stretch]"));
    const marquees = Array.from(root.querySelectorAll<HTMLElement>(".marquee"));
    const live = new Set<HTMLElement>();

    // ——— Medidas (se recalculan al cambiar el tamaño)
    const hero = heroLogo?.closest<HTMLElement>("[data-panel]") ?? null;
    let logoInHero = 0; // centro del logo gigante respecto a la portada (= su centro en pantalla con scroll 0)
    let logoTravel = 1; // distancia hasta el centro de la cabecera
    let logoScroll = 1; // scroll en el que termina de encogerse
    let logoEnd = 1; // escala final (= tamaño del logo de la cabecera)
    const measure = () => {
      if (heroLogo && hero) {
        const prev = heroLogo.style.transform;
        heroLogo.style.transform = "none";
        const r = heroLogo.getBoundingClientRect();
        heroLogo.style.transform = prev;
        logoInHero = r.top - hero.getBoundingClientRect().top + r.height / 2;
        const h = headerLogo?.getBoundingClientRect();
        const headerCenter = h ? h.top + h.height / 2 : 34;
        logoTravel = Math.max(1, logoInHero - headerCenter);
        logoScroll = Math.max(logoTravel, window.innerHeight * 0.35);
        logoEnd = h && r.width ? h.width / r.width : 0.3;
      }
      if (motion) {
        const vh = window.innerHeight;
        panels.forEach((p) => (p.style.top = `${Math.min(0, vh - p.offsetHeight)}px`));
      }
    };

    if (motion) root.classList.add("miu-stack");

    let frame = 0;
    let lastY = window.scrollY;
    let skew = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;

      // Logo gigante → cabecera
      if (heroLogo && hero) {
        const p = clamp(y / logoScroll);
        if (motion) {
          const e = easeOut(p);
          const scale = 1 + (logoEnd - 1) * e;
          // Posición natural en pantalla (la portada puede estar fija o subiendo) → centro de la cabecera
          const natural = hero.getBoundingClientRect().top + logoInHero;
          const shift = logoInHero - logoTravel * e - natural;
          heroLogo.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
          heroLogo.style.opacity = p >= 1 ? "0" : "1";
        }
        html.toggleAttribute("data-logo-docked", motion ? p >= 1 : y > logoInHero);
      }

      // Contador de paneles
      if (counter && counterNum) {
        let current = 1;
        panels.forEach((p, i) => {
          if (p.getBoundingClientRect().top <= vh * 0.5) current = i + 1;
        });
        counterNum.textContent = String(current);
        const afterTop = after ? after.getBoundingClientRect().top : Infinity;
        counter.toggleAttribute("data-on", y > 40 && afterTop > vh * 0.6);
      }

      if (motion) {
        live.forEach((el) => {
          const rect = el.getBoundingClientRect();
          el.style.setProperty(
            "--p",
            clamp((vh - rect.top) / (vh * 0.7 + rect.height * 0.3)).toFixed(4),
          );
        });
        const target = clamp((y - lastY) * 0.12, -7, 7);
        skew += (target - skew) * 0.18;
        if (Math.abs(skew) < 0.02) skew = 0;
        marquees.forEach((m) => m.style.setProperty("--skew", `${skew.toFixed(2)}deg`));
        if (skew !== 0) schedule();
      }
      lastY = y;
    };
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    const onResize = () => {
      measure();
      schedule();
    };
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
    if (motion) stretch.forEach((el) => watch.observe(el));
    const sizes = new ResizeObserver(onResize);
    panels.forEach((p) => sizes.observe(p));

    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    cleanups.push(() => {
      cancelAnimationFrame(frame);
      watch.disconnect();
      sizes.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      root.classList.remove("miu-stack");
      html.removeAttribute("data-logo-docked");
      heroLogo?.style.removeProperty("transform");
      heroLogo?.style.removeProperty("opacity");
      panels.forEach((p) => p.style.removeProperty("top"));
      counter?.removeAttribute("data-on");
      stretch.forEach((el) => el.style.removeProperty("--p"));
      marquees.forEach((m) => m.style.removeProperty("--skew"));
    });

    // ——— Solo con ratón y movimiento: cursor, zoom de producto y botones magnéticos
    if (motion && fine) {
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

        const zoom = target?.closest<HTMLElement>(".miu-tile-media");
        if (zoom && root.contains(zoom)) {
          const r = zoom.getBoundingClientRect();
          zoom.style.setProperty(
            "--ox",
            `${(((event.clientX - r.left) / r.width) * 100).toFixed(1)}%`,
          );
          zoom.style.setProperty(
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
      // Al hacer scroll sin mover el ratón, el cursor se actualiza con lo que queda debajo
      const onScrollCursor = () => {
        const under = document.elementFromPoint(tx, ty);
        const host = under?.closest<HTMLElement>("[data-cursor]");
        cursor.classList.toggle("is-on", !!host && root.contains(host));
      };
      const onLeave = () => cursor.classList.remove("is-on");
      root.classList.add("choreo-fine");
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScrollCursor, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        cancelAnimationFrame(cursorFrame);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", onScrollCursor);
        document.removeEventListener("pointerleave", onLeave);
        root.classList.remove("choreo-fine");
        cursor.remove();
        magnet?.style.removeProperty("translate");
        root.querySelectorAll<HTMLElement>(".miu-tile-media").forEach((el) => {
          el.style.removeProperty("--ox");
          el.style.removeProperty("--oy");
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [rootRef, media]);
}
