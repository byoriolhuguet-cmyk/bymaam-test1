import { Link } from "@tanstack/react-router";
import type { CSSProperties, MouseEvent } from "react";

import { formatPrice, type Product } from "@/data/products";

/** La foto del producto viaja a la ficha con una View Transition (elemento compartido). */
const markShared = (event: MouseEvent<HTMLAnchorElement>) => {
  const media = event.currentTarget.querySelector<HTMLElement>(".tile-media");
  if (media) media.style.setProperty("view-transition-name", "product-hero");
};

export function ProductTile({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 34vw, 82vw",
  headingLevel = 3,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link
      to="/coleccion/$slug"
      params={{ slug: product.slug }}
      className="product-tile group"
      onClick={markShared}
      data-product-slug={product.slug}
      data-product-family={product.family}
      data-product-color={product.color}
    >
      <div className="tile-media">
        <img
          src={product.image}
          srcSet={`${product.image640} 640w, ${product.image} ${product.w}w`}
          sizes={sizes}
          alt={product.alt}
          width={product.w}
          height={product.h}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          style={{ objectPosition: product.pos }}
        />
        {!product.available && <span className="tile-sold">Agotado</span>}
        <span className="tile-pill" aria-hidden="true">Ver pieza →</span>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <Heading className="font-display text-xl md:text-2xl">{product.name}</Heading>
        <span className="text-sm tabular-nums">{formatPrice(product.price)}</span>
      </div>
      <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="swatch" style={{ "--sw": product.swatch } as CSSProperties} aria-hidden="true" />
        {product.color} · {product.strap ? "Incluye correa" : "Funda de piel"}
      </p>
    </Link>
  );
}
