/**
 * Catálogo de By Maam. Fuente única: src/data/products.json
 * (lo leen también los scripts que generan sitemap, llms.txt y products.json).
 *
 * - `vinted`: URL del anuncio en Vinted (vacío → perfil de Vinted).
 * - `available`: pon false cuando una pieza se agote (la web y el SEO lo reflejan).
 */
import raw from "./products.json";

export type Product = {
  slug: string;
  name: string;
  family: "Bolsos" | "Fundas";
  color: string;
  swatch: string;
  price: number;
  leather: string;
  fringe: string;
  studs: string;
  short: string;
  description: string;
  alt: string;
  image: string;
  image640: string;
  w: number;
  h: number;
  vinted: string;
  available: boolean;
  strap: boolean;
  /** object-position para recortar la foto a 4:3 sin cortar el bolso */
  pos: string;
};

export const PRODUCTS = raw as Product[];

export const formatPrice = (value: number) =>
  `${value.toFixed(2).replace(".", ",")} €`;

/** srcset de la foto: 640, 800 (móviles de alta densidad) y original. */
export const productSrcSet = (p: Product) =>
  `${p.image640} 640w, ${p.image.replace(/\.webp$/, "-800.webp")} 800w, ${p.image} ${p.w}w`;

export const productPath = (slug: string) => `/coleccion/${slug}`;

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const BAGS = PRODUCTS.filter((p) => p.family === "Bolsos");
export const CASES = PRODUCTS.filter((p) => p.family === "Fundas");
