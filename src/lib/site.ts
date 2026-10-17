/**
 * Datos globales de By Maam.
 * Fuente única: src/data/site.json (la leen también los scripts de SEO).
 * Dominio: https://bymaam.com ("siteUrl" en src/data/site.json). Si cambia, edítalo ahí
 * y vuelve a hacer el deploy: canonical, sitemap, robots.txt y llms.txt se regeneran solos.
 */
import site from "@/data/site.json";

export const SITE_URL = site.siteUrl;
export const SITE_NAME = site.name;
export const SITE_TAGLINE = site.tagline;
export const FOUNDER = site.founder;

/** Imagen de vista previa al compartir (WhatsApp, Instagram, X…): 1200×630. */
export const OG_IMAGE = `${SITE_URL}/images/brand/og-by-maam.jpg`;
export const LOGO_URL = `${SITE_URL}/images/brand/logo-by-maam.png`;

export const INSTAGRAM_HANDLE = site.instagramHandle;
/** Todo contacto directo va a Instagram (no se publica el teléfono). */
export const WHATSAPP_NUMBER = INSTAGRAM_HANDLE;
export const WHATSAPP_URL = site.instagramUrl;
export const INSTAGRAM_URL = site.instagramUrl;
export const VINTED_URL = site.vintedUrl;
export const TIKTOK_URL = site.tiktokUrl;
export const CONTACT_EMAIL = site.email;

/** Última revisión de contenidos legales y de la web */
export const LAST_UPDATED = site.lastUpdated;
export const LAST_UPDATED_ISO = site.lastUpdatedIso;

/**
 * Endpoints de formularios.
 * TODO: crea los formularios en https://formspree.io y pega aquí los IDs.
 * Mientras estén vacíos, la web ofrece Instagram/email como vía alternativa.
 */
export const FORMSPREE_CONTACT = "";
export const FORMSPREE_ORDERS = "";
/** TODO: Mailchimp o Brevo: pega aquí la URL de acción del formulario. */
export const NEWSLETTER_ENDPOINT = "";

/** TODO: pega tu ID de medición de Google Analytics 4 (G-XXXXXXXXXX) */
export const GA4_ID = "";

export const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/coleccion", label: "Colección" },
  { to: "/sobre-mi", label: "Sobre mí" },
  { to: "/pedidos", label: "Pedidos" },
  { to: "/faq", label: "FAQ" },
  { to: "/contacto", label: "Contacto" },
] as const;

/** Ruta absoluta → URL canónica completa. */
export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path === "/" ? "/" : path.replace(/\/$/, "")}`;
