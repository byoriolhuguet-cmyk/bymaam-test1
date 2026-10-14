import { Link } from "@tanstack/react-router";

import { SplitHeading } from "@/components/site/Motion";

type Action = { href: string; label: string; external?: boolean };

/**
 * Cabecera de página interior estilo Miu Miu: título pequeño centrado, una línea de texto y
 * enlaces subrayados. Siempre incluye un CTA visible sin hacer scroll.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  primary?: Action;
  secondary?: Action;
}) {
  return (
    <section className="miu-page-head">
      <p className="miu-sub" data-reveal>
        {eyebrow}
      </p>
      <SplitHeading as="h1" lines={[title]} className="miu-page-title" />
      {lead && (
        <p className="miu-page-lead" data-reveal style={{ ["--d" as string]: "160ms" }}>
          {lead}
        </p>
      )}
      {(primary || secondary) && (
        <div className="miu-links" data-reveal style={{ ["--d" as string]: "260ms" }}>
          {primary && <Action action={primary} />}
          {secondary && <Action action={secondary} />}
        </div>
      )}
    </section>
  );
}

export function Action({
  action,
  variant = "link",
}: {
  action: Action;
  variant?: "solid" | "ghost" | "link";
}) {
  const cls = variant === "solid" ? "btn-solid" : variant === "ghost" ? "btn-ghost" : "miu-link";
  if (action.external) {
    return (
      <a href={action.href} target="_blank" rel="noopener" className={cls}>
        {action.label}
      </a>
    );
  }
  return (
    <Link to={action.href as "/"} className={cls}>
      {action.label}
    </Link>
  );
}
