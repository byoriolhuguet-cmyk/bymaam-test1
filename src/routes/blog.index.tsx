import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/site/PageHeader";
import { HUBS } from "@/data/guides";
import { POSTS, formatDate, type PostType } from "@/lib/blog";
import { breadcrumbLd, seo } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const TITLE = "Blog de moda: tendencias y bolsos hechos a mano | By Maam";
const DESC =
  "Actualidad de moda cada lunes y guías de compra de bolsos hechos a mano en Barcelona cada jueves. El blog de By Maam.";

const FILTERS: { value?: PostType; label: string }[] = [
  { label: "Todo" },
  { value: "actualidad", label: "Actualidad" },
  { value: "compra", label: "Guías de compra" },
];

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>): { tipo?: PostType } =>
    search["tipo"] === "actualidad" || search["tipo"] === "compra" ? { tipo: search["tipo"] } : {},
  head: () =>
    seo({
      title: TITLE,
      description: DESC,
      path: "/blog",
      jsonLd: [
        breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": `${SITE_URL}/blog#blog`,
          name: `Blog de ${SITE_NAME}`,
          description: DESC,
          url: `${SITE_URL}/blog`,
          inLanguage: "es-ES",
          publisher: { "@id": `${SITE_URL}/#organization` },
          blogPost: POSTS.slice(0, 30).map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${SITE_URL}${p.path}`,
            datePublished: p.date,
            description: p.description,
          })),
        },
      ],
    }),
  component: BlogIndex,
});

function BlogIndex() {
  // El HTML estático es siempre el listado completo: el filtro de la URL se aplica tras hidratar.
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [tipo, setTipo] = useState<PostType | undefined>();
  useEffect(() => setTipo(search.tipo), [search.tipo]);
  const posts = tipo ? POSTS.filter((p) => p.type === tipo) : POSTS;

  return (
    <>
      <PageHeader
        title="Blog de By Maam"
        lead="Cada lunes, lo que ha pasado en la moda esa semana. Cada jueves, una guía para elegir bien tu próximo bolso hecho a mano."
        crumbs={[{ name: "Inicio", to: "/" }]}
      />
      <section className="container-brand pb-24 md:pb-32" aria-label="Artículos">
        <div className="mx-auto max-w-3xl">
          <div role="group" aria-label="Filtrar artículos" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.label}
                type="button"
                className="filter-chip"
                aria-pressed={tipo === f.value}
                onClick={() =>
                  void navigate({ search: f.value ? { tipo: f.value } : {}, replace: true })
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          {posts.length === 0 ? (
            <p className="mt-12 text-muted-foreground">
              Pronto habrá artículos aquí. Mientras, mira la{" "}
              <Link to="/coleccion" className="link-draw text-foreground">
                colección
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link to="/blog/$slug" params={{ slug: p.slug }} className="post-row group">
                    <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {p.typeLabel}, <time dateTime={p.date}>{formatDate(p.date)}</time>
                    </span>
                    <span className="mt-2 block font-display text-2xl leading-tight md:text-3xl">
                      {p.title}
                    </span>
                    <span className="mt-3 block max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-10 text-sm text-muted-foreground">
            Más para leer:{" "}
            <Link to="/guias" className="link-draw text-foreground">
              guías de cuidado y estilo
            </Link>
            {HUBS.map((h) => (
              <span key={h.path}>
                ,{" "}
                <Link to={h.path} className="link-draw text-foreground">
                  {h.name.toLowerCase()}
                </Link>
              </span>
            ))}
            . También en{" "}
            <a href="/feed.xml" className="link-draw text-foreground">
              RSS
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
