import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/site/PageHeader";
import { ProductTile } from "@/components/site/ProductTile";
import { PRODUCTS, formatPrice } from "@/data/products";
import { breadcrumbLd, seo } from "@/lib/seo";
import { INSTAGRAM_URL, SITE_URL, VINTED_URL } from "@/lib/site";

const TITLE = "Bolsos hechos a mano y fundas de piel con flecos | By Maam";
const DESC =
  "Colección de bolsos hechos a mano y fundas de piel con flecos y tachuelas, de Marta Amarelo. Ediciones limitadas, correa incluida. Cómpralos en Vinted.";

/** Filtros en la URL (?tipo=Bolsos&color=Negro&q=flecos): enlazables y usables por agentes. */
type ColeccionSearch = {
  tipo?: string | undefined;
  color?: string | undefined;
  q?: string | undefined;
};

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const Route = createFileRoute("/coleccion/")({
  validateSearch: (search: Record<string, unknown>): ColeccionSearch => ({
    tipo: str(search["tipo"]),
    color: str(search["color"]),
    q: str(search["q"]),
  }),
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
  // El HTML estático se genera sin filtros: se aplican tras hidratar para no romper la hidratación.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const urlSearch = Route.useSearch();
  const search: ColeccionSearch = hydrated ? urlSearch : {};
  const navigate = useNavigate({ from: "/coleccion/" });
  const pick = (options: string[], value?: string) =>
    options.find((o) => value && norm(o) === norm(value)) ?? "Todos";
  const family = pick(families, search.tipo);
  const color = pick(colors, search.color);
  const q = search.q ? norm(search.q) : "";

  const setFilter = (key: "tipo" | "color", value: string) =>
    navigate({
      search: (prev) => ({ ...prev, [key]: value === "Todos" ? undefined : value }),
      replace: true,
      resetScroll: false,
    });
  const setFamily = (v: string) => setFilter("tipo", v);
  const setColor = (v: string) => setFilter("color", v);

  const shown = PRODUCTS.filter(
    (p) =>
      (family === "Todos" || p.family === family) &&
      (color === "Todos" || p.color === color) &&
      (!q || norm(`${p.name} ${p.color} ${p.short} ${p.studs} ${p.fringe}`).includes(q)),
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

      <section className="pb-24 md:pb-32" aria-label="Piezas de la colección">
        <div className="container-brand">
          <div className="miu-filters" role="group" aria-label="Filtros">
            <Filter label="Tipo" options={families} value={family} onChange={setFamily} />
            <Filter label="Color" options={colors} value={color} onChange={setColor} />
          </div>

          {search.q && (
            <p className="-mt-6 mb-10 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              Resultados para «{search.q}»
              <button
                type="button"
                className="filter-chip"
                onClick={() =>
                  navigate({
                    search: (prev) => ({ ...prev, q: undefined }),
                    replace: true,
                    resetScroll: false,
                  })
                }
              >
                Quitar búsqueda ✕
              </button>
            </p>
          )}
        </div>

        <div className="miu-grid" aria-live="polite">
          {shown.map((p, i) => (
            <div key={p.slug} data-reveal style={{ ["--d" as string]: `${(i % 4) * 80}ms` }}>
              <ProductTile
                product={p}
                headingLevel={2}
                priority={i < 2}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              />
            </div>
          ))}
        </div>

        <div className="container-brand">
          {shown.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">
              No hay piezas con esa combinación ahora mismo. Escríbeme por Instagram y lo hago para
              ti.
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-card section-y" aria-labelledby="sobre-bolsos">
        <div className="container-brand grid gap-10 lg:grid-cols-2">
          <h2 id="sobre-bolsos" className="text-3xl leading-tight md:text-5xl" data-reveal>
            Bolsos de piel hechos a mano, uno a uno
          </h2>
          <div
            className="space-y-5 leading-relaxed text-muted-foreground"
            data-reveal
            style={{ ["--d" as string]: "150ms" }}
          >
            <p>
              Los bolsos de By Maam se diseñan, se cortan y se cosen a mano en Barcelona. Cada pieza
              combina piel, flecos largos y tachuelas doradas, bronce o plateadas, y se hace en
              series muy cortas: si un color se agota, normalmente no vuelve igual.
            </p>
            <p>
              Si quieres otro color o una combinación distinta, puedes encargar un modelo
              personalizado. Marta responde en menos de 48 horas.
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
      <span className="miu-filter-label">{label}</span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className="filter-chip"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
