/**
 * WebMCP (navegación agéntica). Expone a agentes de IA del navegador un puñado de
 * herramientas de SOLO LECTURA sobre el catálogo y las formas de compra.
 * Estándar propuesto al W3C (Web Machine Learning CG); en 2026 está en early preview /
 * origin trial en Chrome, así que se detecta por característica y no rompe nada si no existe.
 */
import { PRODUCTS, formatPrice, getProduct, productPath, type Product } from "@/data/products";
import { CONTACT_EMAIL, INSTAGRAM_URL, VINTED_URL, absoluteUrl } from "@/lib/site";

type ToolResult = { content: { type: "text"; text: string }[] };
type Tool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<ToolResult> | ToolResult;
};
type ModelContext = {
  registerTool?: (tool: Tool) => unknown;
  unregisterTool?: (name: string) => unknown;
};

const text = (value: unknown): ToolResult => ({
  content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
});

const summary = (p: Product) => ({
  slug: p.slug,
  nombre: p.name,
  tipo: p.family,
  color: p.color,
  precio: formatPrice(p.price),
  disponible: p.available,
  descripcion: p.short,
  url: absoluteUrl(productPath(p.slug)),
});

const norm = (s: unknown) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const TOOLS: Tool[] = [
  {
    name: "buscar_piezas",
    description:
      "Busca bolsos y fundas de piel hechos a mano de By Maam. Todos los filtros son opcionales. Devuelve nombre, color, precio, disponibilidad y URL de cada pieza.",
    inputSchema: {
      type: "object",
      properties: {
        tipo: { type: "string", enum: ["Bolsos", "Fundas"], description: "Tipo de pieza" },
        color: { type: "string", description: "Color, por ejemplo negro, camel, blanco, violeta, gris, marrón" },
        texto: { type: "string", description: "Texto libre: nombre, tachuelas, flecos…" },
      },
    },
    annotations: { readOnlyHint: true },
    execute: (input) => {
      const color = norm(input['color']);
      const q = norm(input['texto']);
      const found = PRODUCTS.filter(
        (p) =>
          (!input['tipo'] || p.family === input['tipo']) &&
          (!color || norm(p.color).includes(color)) &&
          (!q || norm(`${p.name} ${p.short} ${p.description} ${p.studs} ${p.fringe}`).includes(q)),
      );
      return text({ total: found.length, piezas: found.map(summary) });
    },
  },
  {
    name: "ver_pieza",
    description: "Devuelve la ficha completa de una pieza de By Maam a partir de su slug (por ejemplo bolso-nox).",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string", description: "Identificador de la pieza" } },
      required: ["slug"],
    },
    annotations: { readOnlyHint: true },
    execute: (input) => {
      const p = getProduct(String(input['slug'] ?? ""));
      if (!p) return text({ error: "No existe esa pieza", slugs: PRODUCTS.map((x) => x.slug) });
      return text({
        ...summary(p),
        piel: p.leather,
        flecos: p.fringe,
        tachuelas: p.studs,
        incluyeCorrea: p.strap,
        descripcionCompleta: p.description,
        comprar: p.vinted || VINTED_URL,
      });
    },
  },
  {
    name: "como_comprar_y_contactar",
    description:
      "Explica cómo comprar una pieza de By Maam (Vinted o Instagram), cómo pedir un modelo personalizado y cómo contactar con Marta.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () =>
      text({
        comprar: { vinted: VINTED_URL, instagram: INSTAGRAM_URL },
        pedidoPersonalizado: absoluteUrl("/pedidos"),
        contacto: { email: CONTACT_EMAIL, instagram: INSTAGRAM_URL, formulario: absoluteUrl("/contacto") },
        preguntasFrecuentes: absoluteUrl("/faq"),
        notas: "Piezas de edición limitada hechas a mano por Marta Amarelo en Galicia. Envío con seguimiento. Devoluciones en 14 días.",
      }),
  },
];

/** Registra las herramientas. Devuelve una función para retirarlas. */
export function registerWebMcpTools(): () => void {
  const mc = ((document as unknown as { modelContext?: ModelContext }).modelContext ??
    (navigator as unknown as { modelContext?: ModelContext }).modelContext) as ModelContext | undefined;
  if (!mc || typeof mc.registerTool !== "function") return () => {};
  const registered: string[] = [];
  for (const tool of TOOLS) {
    try {
      mc.registerTool(tool);
      registered.push(tool.name);
    } catch {
      /* ya registrada o no soportada */
    }
  }
  return () => {
    for (const name of registered) {
      try {
        mc.unregisterTool?.(name);
      } catch {
        /* nada */
      }
    }
  };
}
