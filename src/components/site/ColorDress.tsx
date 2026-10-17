import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { BAGS, formatPrice, productSrcSet, type Product } from "@/data/products";
import { VINTED_URL } from "@/lib/site";

/** Paleta que se aplica a toda la web: fondo, texto, tarjeta, texto secundario, acento y texto sobre acento. */
type Palette = {
  bg: string;
  fg: string;
  card: string;
  muted: string;
  accent: string;
  onAccent: string;
  paper: string;
};

const PALETTES: Record<string, Palette> = {
  "bolso-brunello": {
    bg: "#3b2419",
    fg: "#f3e6d8",
    card: "#4a2f22",
    muted: "#d9c7b3",
    accent: "#c9a46a",
    onAccent: "#2a180f",
    paper: "#4a2f22",
  },
  "bolso-savanna": {
    bg: "#ead6b3",
    fg: "#3a2a17",
    card: "#f3e4c8",
    muted: "#6f5a3e",
    accent: "#8a4e1c",
    onAccent: "#f7ead6",
    paper: "#e2cba3",
  },
  "bolso-selene": {
    bg: "#f7f4ef",
    fg: "#2c211b",
    card: "#ffffff",
    muted: "#75665a",
    accent: "#6b4a35",
    onAccent: "#f7f4ef",
    paper: "#efe9e1",
  },
  "bolso-cassis": {
    bg: "#3f3150",
    fg: "#efe6f5",
    card: "#4b3b5e",
    muted: "#cfc4db",
    accent: "#c7b8d6",
    onAccent: "#2c2238",
    paper: "#4b3b5e",
  },
  "bolso-nox": {
    bg: "#141212",
    fg: "#efe9e2",
    card: "#1f1c1c",
    muted: "#b3aba3",
    accent: "#c9c3bb",
    onAccent: "#141212",
    paper: "#1f1c1c",
  },
  "bolso-bruma": {
    bg: "#cbc8bf",
    fg: "#2e2b22",
    card: "#d8d5cd",
    muted: "#55513f",
    accent: "#4d4a30",
    onAccent: "#e9e6dd",
    paper: "#bfbcb2",
  },
};

const TOKENS = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--border",
  "--input",
  "--cocoa",
  "--clay",
  "--wine",
  "--cream",
  "--sand",
  "--paper",
];

function applyPalette(p: Palette | null) {
  const s = document.documentElement.style;
  if (!p) {
    TOKENS.forEach((t) => s.removeProperty(t));
    return;
  }
  const soft = `color-mix(in oklab, ${p.fg} 10%, ${p.bg})`;
  const line = `color-mix(in oklab, ${p.fg} 20%, transparent)`;
  const values: Record<string, string> = {
    "--background": p.bg,
    "--foreground": p.fg,
    "--card": p.card,
    "--card-foreground": p.fg,
    "--popover": p.card,
    "--popover-foreground": p.fg,
    "--primary": p.fg,
    "--primary-foreground": p.bg,
    "--secondary": soft,
    "--secondary-foreground": p.fg,
    "--muted": soft,
    "--muted-foreground": p.muted,
    "--accent": p.accent,
    "--accent-foreground": p.onAccent,
    "--border": line,
    "--input": line,
    "--cocoa": p.fg,
    "--clay": p.muted,
    "--wine": p.accent,
    "--cream": p.onAccent,
    "--sand": `color-mix(in oklab, ${p.accent} 60%, ${p.bg})`,
    "--paper": p.paper,
  };
  Object.entries(values).forEach(([k, v]) => s.setProperty(k, v));
}

const STRANDS = 28;

/** Cortina de flecos: tiras que caen, cambian el color a mitad y siguen cayendo. */
function fringeWipe(curtain: HTMLDivElement | null, color: string, midway: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!curtain || reduce || typeof curtain.animate !== "function") {
    midway();
    return;
  }
  const strands = Array.from(curtain.children) as HTMLElement[];
  const dist = strands.map((_, i) => Math.abs(i - STRANDS / 2) / (STRANDS / 2));
  curtain.style.setProperty("--c", color);
  curtain.hidden = false;
  const ins = strands.map((s, i) =>
    s.animate([{ transform: "translate3d(0,-101%,0)" }, { transform: "translate3d(0,0,0)" }], {
      duration: 480,
      delay: (1 - dist[i]!) * 150 + Math.random() * 60,
      easing: "cubic-bezier(0.77, 0, 0.175, 1)",
      fill: "forwards",
    }),
  );
  Promise.all(ins.map((a) => a.finished))
    .then(() => {
      midway();
      const outs = strands.map((s, i) =>
        s.animate([{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(0,101%,0)" }], {
          duration: 620,
          delay: dist[i]! * 170 + Math.random() * 70,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
          fill: "forwards",
        }),
      );
      return Promise.all(outs.map((a) => a.finished));
    })
    .catch(() => midway())
    .finally(() => {
      strands.forEach((s) => s.getAnimations().forEach((a) => a.cancel()));
      curtain.hidden = true;
    });
}

const DEFAULT = BAGS.find((b) => b.slug === "bolso-nox") ?? BAGS[0]!;
const CHOICES = BAGS.filter((b) => PALETTES[b.slug]);

/** "La web se viste de tu bolso": elige un color y toda la página adopta la paleta de esa pieza. */
export function ColorDress() {
  const [choice, setChoice] = useState<string | null>(null);
  const [shown, setShown] = useState<Product>(DEFAULT);
  const curtainRef = useRef<HTMLDivElement>(null);

  // Al salir de la portada la web vuelve a sus colores
  useEffect(() => () => applyPalette(null), []);

  const pick = (product: Product | null) => {
    const slug = product?.slug ?? null;
    if (slug === choice) return;
    setChoice(slug);
    const palette = product ? PALETTES[product.slug]! : null;
    fringeWipe(curtainRef.current, palette?.bg ?? "var(--color-wine)", () => {
      applyPalette(palette);
      setShown(product ?? DEFAULT);
    });
  };

  return (
    <section className="color-dress section-y" aria-labelledby="tu-color">
      <div className="fringe-curtain" ref={curtainRef} aria-hidden="true" hidden>
        {Array.from({ length: STRANDS }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <div className="container-brand">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow" data-reveal>
              Tu color
            </p>
            <h2 id="tu-color" className="mt-4 text-4xl leading-[1.02] md:text-6xl" data-reveal>
              La web se viste <em className="text-wine">de tu bolso</em>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Elegir el color de la web">
            <button
              type="button"
              className="color-chip"
              aria-pressed={choice === null}
              onClick={() => pick(null)}
            >
              <i style={{ "--sw": "#6e0f1b" } as CSSProperties} aria-hidden="true" />
              By Maam
            </button>
            {CHOICES.map((p) => (
              <button
                key={p.slug}
                type="button"
                className="color-chip"
                aria-pressed={choice === p.slug}
                onClick={() => pick(p)}
              >
                <i style={{ "--sw": p.swatch } as CSSProperties} aria-hidden="true" />
                {p.name.replace(/^Bolso /, "")}
              </button>
            ))}
          </div>
        </div>

        <div className="color-show" aria-live="polite">
          <img
            key={shown.slug}
            src={shown.image}
            srcSet={productSrcSet(shown)}
            sizes="(min-width: 1024px) 50vw, 92vw"
            alt={shown.alt}
            width={shown.w}
            height={shown.h}
            loading="lazy"
            decoding="async"
          />
          <div>
            <h3 className="font-display text-5xl leading-[0.95] md:text-7xl">
              {shown.name.replace(/^Bolso /, "")}
            </h3>
            <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">{shown.short}</p>
            <a
              href={shown.vinted || VINTED_URL}
              target="_blank"
              rel="noopener"
              className="btn-solid mt-8"
            >
              Ver en Vinted · {formatPrice(shown.price)}{" "}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
