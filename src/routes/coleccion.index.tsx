import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/site/PageHeader";
import { ProductTile } from "@/components/site/ProductTile";
import { PRODUCTS, formatPrice } from "@/data/products";
import { breadcrumbLd, seo } from "@/lib/seo";
import { INSTAGRAM_URL, SITE_URL, VINTED_URL } from "@/lib/site";

const TITLE = "Bolsos hechos a mano y fundas de piel con flecos | By Maam";
const DESC =
  "Colección de bolsos hechos a mano y fundas de piel con flecos y tachuelas, de Marta Amarelo. Ediciones limitadas, correa incluida. Cómpralos en Vinted.";

export const Route = createFileRoute("/coleccion/")({
  head: () =>
    seo({
      title: TITLE,
      description: DESC,
      path: "/coleccion",
      jsonLd: [
        breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Colección", path: "/coleccion" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Colección By Maam: bolsos hechos a mano",
          url: `${SITE_URL}/coleccion`,
          inLanguage: "es-ES",
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: PRODUCTS.length,
            itemListElement: PRODUCTS.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/coleccion/${p.slug}`,
              name: `${p.name} ${p.color}`,
              image: `${SITE_URL}${p.image}`,
            })),
          },
        },
      ],
    }),
  component: ColeccionPage,
});

function ColeccionPage() {
  const families = useMemo(() => ["Todos", ...new Set(PRODUCTS.map((p) => p.family))], []);
  const colors = useMemo(() => ["Todos", ...new Set(PRODUCTS.map((p) => p.color))], []);
  const [family, setFamily] = useState("Todos");
  const [color, setColor] = useState("Todos");

  const shown = PRODUCTS.filter(
    (p) => (family === "Todos" || p.family === family) && (color === "Todos" || p.color === color),
  );
  const bagPrice = PRODUCTS.find((p) => p.family === "Bolsos")?.price ?? 0;
  const casePrice = PRODUCTS.find((p) => p.family === "Fundas")?.price ?? 0;

  return (
    <>
      <PageHeader
        eyebrow="Colección"
        title="Bolsos hechos a mano, cada uno único"
        lead={`Bolsos desde ${formatPrice(bagPrice)} y fundas desde ${formatPrice(casePrice)}. Todos los bolsos llevan correa incluida.`}
        primary={{ href: VINTED_URL, label: "Comprar en Vinted", external: true }}
        secondary={{ href: INSTAGRAM_URL, label: "Preguntar por Instagram", external: true }}
      />

      <section className="section-y pt-12 md:pt-16" aria-label="Piezas de la colección">
        <div className="container-brand">
          <div className="mb-12 flex flex-col gap-5 border-y border-border py-5 lg:flex-row lg:items-center lg:justify-between" role="group" aria-label="Filtros">
            <Filter label="Tipo" options={families} value={family} onChange={setFamily} />
            <Filter label="Color" options={colors} value={color} onChange={setColor} />
          </div>

          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            {shown.map((p, i) => (
              <div key={p.slug} data-reveal style={{ ["--d" as string]: `${(i % 3) * 90}ms` }}>
                <ProductTile product={p} headingLevel={2} priority={i < 3} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw" />
              </div>
            ))}
          </div>

          {shown.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">
              No hay piezas con esa combinación ahora mismo. Escríbeme por Instagram y lo hago para ti.
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-card section-y" aria-labelledby="sobre-bolsos">
        <div className="container-brand grid gap-10 lg:grid-cols-2">
          <h2 id="sobre-bolsos" className="text-3xl leading-tight md:text-5xl" data-reveal>
            Bolsos de piel hechos a mano, uno a uno
          </h2>
          <div className="space-y-5 leading-relaxed text-muted-foreground" data-reveal style={{ ["--d" as string]: "150ms" }}>
            <p>
              Los bolsos de By Maam se diseñan, se cortan y se cosen a mano en Galicia. Cada pieza combina piel, flecos largos y tachuelas doradas, bronce o plateadas, y se hace en series muy cortas: si un color se agota, normalmente no vuelve igual.
            </p>
            <p>
              Si quieres otro color o una combinación distinta, puedes encargar un modelo personalizado. Marta responde en menos de 48 horas.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Filter({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-2">{label}</span>
      {options.map((o) => (
        <button key={o} type="button" className="filter-chip" aria-pressed={value === o} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}
