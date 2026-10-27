/**
 * Telaraña de enlaces (SEO): la colección es la página pilar, cada hub agrupa las piezas por lo que
 * la gente busca (flecos, tachuelas, fundas para portátil) y las guías enlazan siempre hacia dentro:
 * a 3 o más fichas y a su hub, nunca directamente a Vinted.
 *
 * Todo el contenido sale de datos reales de la web (materiales, colores, precios, plazos, devoluciones).
 * No hay medidas: cuando Marta las pase, se añaden a src/data/products.json y a las fichas.
 */
import { PRODUCTS, type Product } from "@/data/products";

export type Block = { heading: string; paragraphs: string[]; list?: string[] };

export type Hub = {
  path: "/bolsos-con-flecos" | "/bolsos-con-tachuelas" | "/fundas-portatil";
  name: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  products: (p: Product) => boolean;
  blocks: Block[];
  guides: GuideSlug[];
};

export type GuideSlug = "como-cuidar-un-bolso-con-flecos" | "como-combinar-un-bolso-con-flecos";

export type Guide = {
  slug: GuideSlug;
  title: string;
  description: string;
  h1: string;
  lead: string;
  hub: Hub["path"];
  blocks: (Block & { products?: string[] })[];
};

const hasStuds = (p: Product) => !/^sin\b/i.test(p.studs);

export const HUBS: Hub[] = [
  {
    path: "/bolsos-con-flecos",
    name: "Bolsos con flecos",
    title: "Bolsos con flecos hechos a mano | By Maam",
    description:
      "Bolsos con flecos largos, hechos a mano en Barcelona: seis modelos en piel sintética, con correa incluida y en edición limitada. 38,50 €.",
    h1: "Bolsos con flecos hechos a mano",
    lead: "Seis modelos con flecos largos que se mueven al caminar. Cortados y cosidos uno a uno en Barcelona, con la correa incluida.",
    products: (p) => p.family === "Bolsos",
    blocks: [
      {
        heading: "Cómo son los flecos de By Maam",
        paragraphs: [
          "Cada bolso lleva una solapa de piel sintética y debajo una caída de flecos largos y densos. Los flecos van cosidos a mano, fila a fila, y se mueven con el cuerpo: es lo que hace que el bolso se vea distinto en foto y en persona.",
          "El color de los flecos no siempre coincide con el de la solapa. En Brunello van a juego, en marrón chocolate. En Selene son marrones sobre una solapa blanca, y en Cassis son grises bajo un violeta texturizado.",
        ],
      },
      {
        heading: "Qué modelo elegir",
        paragraphs: [
          "Si buscas algo que combine con todo, Bruma (gris suave) y Savanna (camel) son los más fáciles. Nox, negro total con tachuelas plateadas, es el más de noche. Selene y Cassis son los que más destacan por contraste de color.",
        ],
      },
      {
        heading: "Edición limitada y pedidos personalizados",
        paragraphs: [
          "Cada modelo se hace en series muy cortas: cuando un color se agota, normalmente no vuelve igual. Si quieres otra combinación de solapa, flecos y tachuelas, puedes encargarla desde la página de pedidos personalizados.",
        ],
      },
    ],
    guides: ["como-cuidar-un-bolso-con-flecos", "como-combinar-un-bolso-con-flecos"],
  },
  {
    path: "/bolsos-con-tachuelas",
    name: "Bolsos con tachuelas",
    title: "Bolsos con tachuelas doradas, bronce y plateadas | By Maam",
    description:
      "Bolsos hechos a mano con tachuelas doradas, bronce o plateadas sobre la solapa, y flecos largos. Hechos en Barcelona, correa incluida. 38,50 €.",
    h1: "Bolsos con tachuelas",
    lead: "Tachuelas doradas, bronce o plateadas, colocadas a mano sobre la solapa. Elige el bolso por el color del herraje.",
    products: (p) => p.family === "Bolsos" && hasStuds(p),
    blocks: [
      {
        heading: "Doradas, bronce o plateadas",
        paragraphs: [
          "Las tachuelas doradas dan un aire cálido y van con marrones y camel: Brunello, Savanna y Bruma las llevan. Las de color bronce, en Selene, suavizan el contraste del blanco con los flecos marrones. Las plateadas, en Nox, encajan con el negro y con joyería plateada.",
        ],
      },
      {
        heading: "Cómo se colocan",
        paragraphs: [
          "Las tachuelas se marcan y se fijan a mano sobre la solapa, en filas. Por eso no hay dos bolsos exactamente iguales: la separación cambia muy poco de una pieza a otra.",
          "Si prefieres un bolso sin herrajes, Cassis lleva solo color y textura, sin tachuelas.",
        ],
      },
    ],
    guides: ["como-combinar-un-bolso-con-flecos", "como-cuidar-un-bolso-con-flecos"],
  },
  {
    path: "/fundas-portatil",
    name: "Fundas para portátil",
    title: "Fundas para portátil con flecos y tachuelas, hechas a mano | By Maam",
    description:
      "Fundas para portátil de piel sintética con flecos y tachuelas, hechas a mano en Barcelona. Tres modelos en edición limitada. 42,90 €.",
    h1: "Fundas para portátil hechas a mano",
    lead: "La misma solapa con tachuelas y los mismos flecos que los bolsos, pensados para llevar el portátil. Tres modelos, 42,90 €.",
    products: (p) => p.family === "Fundas",
    blocks: [
      {
        heading: "Tres fundas, tres herrajes",
        paragraphs: [
          "Lumen es blanca, con tres filas de tachuelas plateadas y flecos grises. Nero es negra con tachuelas plateadas y flecos negros. Eclipse es negra con tachuelas doradas.",
        ],
      },
      {
        heading: "Antes de comprar, comprueba la medida",
        paragraphs: [
          "Cada funda se corta a mano. Si tienes dudas sobre si tu portátil cabe, escribe a Marta por Instagram con el modelo de tu ordenador y te lo confirma antes de comprar.",
          "Las fundas no llevan correa: se llevan en la mano o dentro de otro bolso.",
        ],
      },
    ],
    guides: ["como-cuidar-un-bolso-con-flecos"],
  },
];

export const GUIDES: Guide[] = [
  {
    slug: "como-cuidar-un-bolso-con-flecos",
    title: "Cómo cuidar un bolso con flecos de piel sintética | By Maam",
    description:
      "Limpieza, flecos enredados, tachuelas y cómo guardar un bolso con flecos de piel sintética para que dure. Guía de By Maam.",
    h1: "Cómo cuidar un bolso con flecos",
    lead: "Un bolso con flecos de piel sintética pide poco: limpiarlo en seco o con un paño húmedo, peinar los flecos de vez en cuando y guardarlo sin aplastarlo.",
    hub: "/bolsos-con-flecos",
    blocks: [
      {
        heading: "Limpieza del día a día",
        paragraphs: [
          "La piel sintética se limpia con un paño suave apenas húmedo y, si hace falta, una gota de jabón neutro. Seca después con otro paño. No lo metas en la lavadora ni lo sumerjas: los flecos y las costuras sufren.",
        ],
        list: [
          "Paño suave, apenas húmedo.",
          "Jabón neutro solo si hay una mancha concreta.",
          "Nada de disolventes, alcohol ni productos para piel natural.",
        ],
        products: ["bolso-selene", "funda-lumen"],
      },
      {
        heading: "Flecos enredados",
        paragraphs: [
          "Si los flecos se enredan, sepáralos con los dedos desde la punta hacia arriba, nunca tirando desde la raíz. Un peine de púas anchas también funciona. Cuélgalo un rato y vuelven a caer rectos.",
        ],
        products: ["bolso-savanna", "bolso-brunello"],
      },
      {
        heading: "Tachuelas",
        paragraphs: [
          "Las tachuelas se limpian con un paño seco. Evita que se mojen a menudo y no las frotes con productos abrasivos: pierden el brillo.",
        ],
        products: ["bolso-nox"],
      },
      {
        heading: "Cómo guardarlo",
        paragraphs: [
          "Guárdalo relleno con papel para que la solapa no se doble, con los flecos estirados hacia abajo y lejos del sol directo y de fuentes de calor. Si viaja en la maleta, mejor dentro de una bolsa de tela.",
          "Si una costura se suelta por el uso normal, escribe a Marta: lo repara sin coste durante los dos primeros años.",
        ],
      },
    ],
  },
  {
    slug: "como-combinar-un-bolso-con-flecos",
    title: "Cómo combinar un bolso con flecos: ideas por color | By Maam",
    description:
      "Ideas para combinar un bolso con flecos según su color: camel, negro, blanco, gris y violeta. Con los modelos de By Maam.",
    h1: "Cómo combinar un bolso con flecos",
    lead: "Un bolso con flecos ya tiene mucho movimiento. Funciona mejor con prendas sencillas y con un color que lo acompañe, no que compita.",
    hub: "/bolsos-con-flecos",
    blocks: [
      {
        heading: "Camel y marrones: con denim y tonos tierra",
        paragraphs: [
          "Savanna y Brunello son los más fáciles de llevar a diario. Quedan bien con vaqueros, blanco roto, beige y punto grueso. Las tachuelas doradas acompañan a joyería dorada.",
        ],
        products: ["bolso-savanna", "bolso-brunello"],
      },
      {
        heading: "Negro: de día con básicos, de noche con todo",
        paragraphs: [
          "Nox, negro total con tachuelas plateadas, funciona con negro sobre negro o con una camisa blanca. Es el que mejor pasa de día a noche.",
        ],
        products: ["bolso-nox"],
      },
      {
        heading: "Blanco y gris: para looks claros",
        paragraphs: [
          "Selene, blanco con flecos marrones, va bien en primavera y verano con lino y tonos claros. Bruma, gris suave, es el más neutro de la colección y combina con casi todo.",
        ],
        products: ["bolso-selene", "bolso-bruma"],
      },
      {
        heading: "Violeta: el bolso es el protagonista",
        paragraphs: [
          "Cassis, violeta texturizado con flecos grises, pide el resto del look en neutros: gris, negro o vaquero lavado. Sin tachuelas, todo el peso está en el color.",
        ],
        products: ["bolso-cassis"],
      },
    ],
  },
];

export const hubFor = (p: Product): Hub =>
  HUBS.find((h) => h.path === (p.family === "Fundas" ? "/fundas-portatil" : "/bolsos-con-flecos"))!;
export const hubProducts = (h: Hub) => PRODUCTS.filter(h.products);
export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
export const guidePath = (slug: GuideSlug) => `/guias/${slug}`;
export const hasStudsProduct = hasStuds;
