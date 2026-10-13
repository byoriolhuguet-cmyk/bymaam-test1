import type { CSSProperties, ElementType, ReactNode } from "react";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Titular dividido en líneas con máscara. Mantiene un espacio entre líneas para buscadores y lectores de pantalla. */
export function SplitHeading({
  as: Tag = "h2",
  lines,
  className = "",
  delay = 0,
  id,
}: {
  as?: ElementType;
  lines: ReactNode[];
  className?: string;
  delay?: number;
  id?: string;
}) {
  return (
    <Tag className={className} data-split style={{ "--d": `${delay}ms` } as Vars} id={id}>
      {lines.map((line, i) => (
        <span key={i}>
          <span className="split-line">
            <span style={{ "--i": i } as Vars}>{line}</span>
          </span>{" "}
        </span>
      ))}
    </Tag>
  );
}

/** Texto cuyas palabras se iluminan con el scroll. */
export function LitWords({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <p className={`lit-words ${className}`} data-progress="lit">
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="w" style={{ "--i": i, "--n": words.length } as Vars}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

/** Cinta de texto en bucle infinito (se pausa al pasar el ratón; estática con movimiento reducido). */
export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <div className={`marquee ${className}`}>
      <div className="marquee-track">
        <div className="marquee-group">
          {items.map((item) => (
            <span key={item} className="marquee-item">
              {item}
            </span>
          ))}
        </div>
        <div className="marquee-group" aria-hidden="true">
          {items.map((item) => (
            <span key={item} className="marquee-item">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
