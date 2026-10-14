import { Link } from "@tanstack/react-router";
import type { MouseEvent } from "react";

import { formatPrice, productSrcSet, type Product } from "@/data/products";
import { INSTAGRAM_URL, VINTED_URL } from "@/lib/site";

/** La foto del producto viaja a la ficha con una View Transition (elemento compartido). */
const markShared = (event: MouseEvent<HTMLAnchorElement>) => {
  event.currentTarget.style.setProperty("view-transition-name", "product-hero");
};

/**
 * Pieza en cuadrícula estilo Miu Miu: foto a sangre sobre fondo de estudio, nombre y precio
 * pequeños y centrados, y enlaces subrayados a Vinted e Instagram.
 */
export function ProductTile({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  headingLevel = 3,
  actions = true,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  headingLevel?: 2 | 3;
  /** Enlaces "Comprar en Vinted" / "Instagram" bajo la pieza. */
  actions?: boolean;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const name = product.name.replace(/^(Bolso|Funda) /, "");
  return (
    <div
      className="miu-tile product-card"
      data-product-slug={product.slug}
      data-product-family={product.family}
      data-product-color={product.color}
    >
      <Link
        to="/coleccion/$slug"
        params={{ slug: product.slug }}
        className="miu-tile-media"
        onClick={markShared}
        data-cursor="Ver"
        aria-label={`${product.name}, ${product.color}, ${formatPrice(product.price)}`}
      >
        <img
          src={product.image}
          srcSet={productSrcSet(product)}
          sizes={sizes}
          alt={product.alt}
          width={product.w}
          height={product.h}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
        />
        {!product.available && <span className="tile-sold">Agotado</span>}
      </Link>
      <Heading className="miu-tile-label">
        {product.family === "Fundas" ? `Funda ${name}` : name}
      </Heading>
      <p className="miu-tile-note">
        {product.color} · {formatPrice(product.price)}
      </p>
      {actions && (
        <div className="miu-links miu-links--tight">
          <a
            href={product.vinted || VINTED_URL}
            target="_blank"
            rel="noopener"
            className="miu-link"
            aria-label={`Comprar en Vinted: ${product.name}`}
          >
            Comprar en Vinted
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener"
            className="miu-link"
            aria-label={`Instagram: preguntar por ${product.name}`}
          >
            Instagram
          </a>
        </div>
      )}
    </div>
  );
}
