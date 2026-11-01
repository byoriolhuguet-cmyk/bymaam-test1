import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { GUIDES, HUBS, guidePath } from "@/data/guides";
import { breadcrumbLd, seo } from "@/lib/seo";

const TITLE = "Guías: cuidar y combinar bolsos con flecos | By Maam";
const DESC =
  "Guías de By Maam para cuidar un bolso con flecos de piel sintética y combinarlo según su color.";

export const Route = createFileRoute("/guias/")({
  head: () =>
    seo({
      title: TITLE,
      description: DESC,
      path: "/guias",
      jsonLd: breadcrumbLd([
        { name: "Inicio", path: "/" },
        { name: "Guías", path: "/guias" },
      ]),
    }),
  component: GuiasPage,
});

function GuiasPage() {
  return (
    <>
      <PageHeader
        title="Guías para tu bolso con flecos"
        lead="Cómo cuidarlo para que dure y cómo combinarlo según su color."
        crumbs={[{ name: "Inicio", to: "/" }]}
      />
      <section className="container-brand pb-24 md:pb-32" aria-label="Guías">
        <ul className="mx-auto max-w-2xl divide-y divide-border border-y border-border">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link to={guidePath(g.slug) as "/"} className="block py-8">
                <span className="block font-display text-2xl md:text-3xl">{g.h1}</span>
                <span className="mt-2 block max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                  {g.lead}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-2xl text-sm text-muted-foreground">
          Por tipo de pieza:{" "}
          {HUBS.map((h, i) => (
            <span key={h.path}>
              {i > 0 && ", "}
              <Link to={h.path} className="link-draw text-foreground">
                {h.name.toLowerCase()}
              </Link>
            </span>
          ))}
          .
        </p>
      </section>
    </>
  );
}
