import { useEffect } from "react";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/**
 * Motor de movimiento de toda la web. Una sola instancia, montada en la raíz.
 *
 *  - [data-reveal] / [data-split]: añaden `.is-in` al entrar en pantalla (IntersectionObserver).
 *  - [data-parallax="0.06"]: desplazamiento vertical suave según el scroll (--py).
 *  - [data-progress] / [data-progress="lit"]: progreso 0..1 del elemento por la pantalla (--p).
 *
 * Solo actúa si el script inline de <head> marcó `html.motion-ok`
 * (JS activo y sin prefers-reduced-motion). Si no, todo el contenido queda visible y estático.
 * Una única rAF por scroll, listeners pasivos y solo sobre elementos visibles.
 */
export function useMotionEngine(pathname: string) {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("motion-ok")) return;

    const seen = new WeakSet<Element>();
    const live = new Set<HTMLElement>();
    let frame = 0;

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.1 },
    );

    const watch = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) live.add(el);
          else live.delete(el);
        }
        schedule();
      },
      { rootMargin: "25% 0px 25% 0px" },
    );

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      live.forEach((el) => {
        if (!el.isConnected) {
          live.delete(el);
          return;
        }
        const rect = el.getBoundingClientRect();
        if (el.hasAttribute("data-parallax")) {
          const speed = parseFloat(el.getAttribute("data-parallax") || "0.06");
          const offset = rect.top + rect.height / 2 - vh / 2;
          el.style.setProperty("--py", `${(-offset * speed).toFixed(1)}px`);
        }
        if (el.hasAttribute("data-progress")) {
          const lit = el.getAttribute("data-progress") === "lit";
          const p = lit
            ? clamp((vh * 0.9 - rect.top) / (vh * 0.5 + rect.height * 0.55))
            : clamp((vh - rect.top) / (vh + rect.height));
          el.style.setProperty("--p", p.toFixed(4));
        }
      });
    };

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    const scan = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>("[data-reveal], [data-split]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        reveal.observe(el);
      });
      root.querySelectorAll<HTMLElement>("[data-parallax], [data-progress]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        watch.observe(el);
      });
    };

    scan(document);

    let pending = 0;
    const mutations = new MutationObserver(() => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        scan(document);
      });
    });
    mutations.observe(document.getElementById("contenido") ?? document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      reveal.disconnect();
      watch.disconnect();
      mutations.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
    // El motor vuelve a escanear en cada cambio de ruta
  }, [pathname]);
}

/**
 * Script inline que se ejecuta ANTES de pintar: decide si hay movimiento y si
 * toca pantalla de carga (solo en la portada y solo una vez por sesión).
 */
export const MOTION_BOOT_SCRIPT = `(function(d){try{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!r)d.classList.add('motion-ok');var seen=false;try{seen=!!sessionStorage.getItem('bymaam-intro')}catch(e){}var home=location.pathname==='/'||location.pathname==='/index.html';d.setAttribute('data-intro',(!r&&home&&!seen)?'run':'skip')}catch(e){d.setAttribute('data-intro','skip')}})(document.documentElement)`;
