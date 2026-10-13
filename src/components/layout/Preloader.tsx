import { useEffect, useRef, useState } from "react";

import { BAGS } from "@/data/products";

const DURATION = 2100;

/**
 * Pantalla de carga estilo editorial: contador 000 a 100, secuencia de piezas
 * y cortina vino que sube. Solo en la portada y una vez por sesión: el script
 * inline de <head> marca html[data-intro="run"] antes de pintar. Con movimiento
 * reducido, en otras páginas o sin JS, nunca se muestra.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (document.documentElement.getAttribute("data-intro") === "run") setRun(true);
  }, []);

  useEffect(() => {
    if (!run) return;
    const html = document.documentElement;
    const root = rootRef.current;
    if (!root) return;
    const images = Array.from(root.querySelectorAll<HTMLImageElement>("img"));
    let raf = 0;
    let last = -1;
    let started = false;
    const timers: number[] = [];

    const finish = () => {
      html.setAttribute("data-intro", "done");
      try {
        sessionStorage.setItem("bymaam-intro", "1");
      } catch {
        /* sin almacenamiento: no pasa nada */
      }
    };

    const start = () => {
      if (started) return;
      started = true;
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / DURATION);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        if (countRef.current) countRef.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
        root.style.setProperty("--load", eased.toFixed(3));
        const idx = Math.min(images.length - 1, Math.floor(t * images.length));
        if (idx !== last) {
          images.forEach((img, i) => img.classList.toggle("is-on", i === idx));
          last = idx;
        }
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          html.setAttribute("data-intro", "out");
          timers.push(window.setTimeout(finish, 1050));
        }
      };
      raf = requestAnimationFrame(tick);
    };

    // Arranca cuando hay al menos una imagen lista (o a los 500 ms)
    const first = images[0];
    if (first?.complete) start();
    else first?.addEventListener("load", start, { once: true });
    timers.push(window.setTimeout(start, 500));
    // Red de seguridad: nunca bloquea la web
    timers.push(window.setTimeout(finish, 6500));

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [run]);

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <div className="preloader-mark">
        <small>by</small>
        <span>maam</span>
      </div>
      <p className="preloader-note">Handmade · Galicia</p>
      <div className="preloader-card">
        {run &&
          BAGS.map((p) => (
            <img key={p.slug} src={p.image640} alt="" width={640} height={480} decoding="async" style={{ objectPosition: p.pos }} />
          ))}
      </div>
      <span className="preloader-count">
        <span ref={countRef}>000</span>
      </span>
      <div className="preloader-bar" />
    </div>
  );
}
