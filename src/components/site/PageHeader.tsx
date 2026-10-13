import { Link } from "@tanstack/react-router";

import { SplitHeading } from "@/components/site/Motion";

type Action = { href: string; label: string; external?: boolean };

/** Cabecera de página interior. Siempre incluye un CTA visible sin hacer scroll. */
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
    <section className="page-hero linen">
      <div className="container-brand py-16 md:py-24">
        <p className="eyebrow" data-reveal>{eyebrow}</p>
        <SplitHeading as="h1" lines={[title]} className="display-xl mt-6 max-w-4xl" />
        {lead && (
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground" data-reveal style={{ ["--d" as string]: "200ms" }}>
            {lead}
          </p>
        )}
        {(primary || secondary) && (
          <div className="mt-9 flex flex-col gap-3 sm:flex-row" data-reveal style={{ ["--d" as string]: "320ms" }}>
            {primary && <Action action={primary} variant="solid" />}
            {secondary && <Action action={secondary} variant="ghost" />}
          </div>
        )}
      </div>
    </section>
  );
}

export function Action({
  action,
  variant = "solid",
}: {
  action: Action;
  variant?: "solid" | "ghost";
}) {
  const base = variant === "solid" ? "btn-solid" : "btn-ghost";

  if (action.external) {
    return (
      <a href={action.href} target="_blank" rel="noopener" className={base}>
        {action.label}
      </a>
    );
  }
  return (
    <Link to={action.href as "/"} className={base}>
      {action.label}
    </Link>
  );
}
