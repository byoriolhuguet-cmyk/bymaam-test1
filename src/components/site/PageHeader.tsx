import { Link } from "@tanstack/react-router";

import { SplitHeading } from "@/components/site/Motion";

type Action = { href: string; label: string; external?: boolean };

export type Crumb = { name: string; to: string };

/**
 * Cabecera de página interior. Sin etiqueta sobre el título: el H1 se basta solo. Cuando la página
 * cuelga de otra (hubs, guías) muestra migas de pan, que sí ayudan a navegar y a Google.
 * Siempre incluye un CTA visible sin hacer scroll cuando lo hay.
 */
export function PageHeader({
  title,
  lead,
  primary,
  secondary,
  crumbs,
}: {
  /** Ya no se pinta (etiqueta sobre el título); se mantiene para no romper las páginas existentes. */
  eyebrow?: string;
  title: string;
  lead?: string;
  primary?: Action;
  secondary?: Action;
  crumbs?: Crumb[];
}) {
  return (
    <section className="page-hero linen">
      <div className="container-brand py-16 md:py-24">
        {crumbs && crumbs.length > 0 && (
          <nav
            aria-label="Migas de pan"
            className="mb-8 text-xs tracking-wide text-muted-foreground"
          >
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((c, i) => (
                <li key={c.to} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  <Link to={c.to as "/"} className="link-draw tap">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-2" aria-current="page">
                <span aria-hidden="true">/</span>
                <span className="text-foreground">{title}</span>
              </li>
            </ol>
          </nav>
        )}
        <SplitHeading as="h1" lines={[title]} className="display-xl max-w-4xl" />
        {lead && (
          <p
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground"
            data-reveal
            style={{ ["--d" as string]: "200ms" }}
          >
            {lead}
          </p>
        )}
        {(primary || secondary) && (
          <div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            data-reveal
            style={{ ["--d" as string]: "320ms" }}
          >
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
