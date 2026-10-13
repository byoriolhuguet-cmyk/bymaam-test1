import type { ErrorComponentProps } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { ExitIntentPopup } from "@/components/layout/ExitIntentPopup";
import { MotionExperience } from "@/components/layout/MotionExperience";
import { Button } from "@/components/ui/button";
import { Preloader } from "@/components/layout/Preloader";
import { MOTION_BOOT_SCRIPT } from "@/lib/motion";
import { registerWebMcpTools } from "@/lib/webmcp";
import {
  CONTACT_EMAIL,
  FOUNDER,
  INSTAGRAM_URL,
  LOGO_URL,
  NEWSLETTER_ENDPOINT,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  TIKTOK_URL,
  VINTED_URL,
} from "@/lib/site";

const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "By Maam Handmade",
  description:
    "Bolsos y fundas de piel hechos a mano por Marta Amarelo en Barcelona. Ediciones limitadas con flecos y tachuelas.",
  url: SITE_URL,
  logo: LOGO_URL,
  image: OG_IMAGE,
  email: CONTACT_EMAIL,
  slogan: "Bolsos hechos a mano",
  founder: { "@type": "Person", name: FOUNDER },
  areaServed: "ES",
  address: { "@type": "PostalAddress", addressCountry: "ES", addressLocality: "Barcelona", addressRegion: "Cataluña" },
  knowsAbout: ["bolsos hechos a mano", "bolsos de piel", "bolsos con flecos", "artesanía en piel"],
  sameAs: [INSTAGRAM_URL, TIKTOK_URL, VINTED_URL],
};

const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "es-ES",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/coleccion?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

function NotFoundComponent() {
  return (
    <div className="linen flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="rule-label">Error 404</p>
        <h1 className="mt-6 text-4xl">Esta página no existe</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Puede que el bolso que buscabas ya se haya vendido. Echa un vistazo a la colección.
        </p>
        <div className="mt-8">
          <Link
            to="/coleccion"
            className="inline-flex items-center justify-center border border-primary bg-primary px-7 py-3.5 text-sm text-primary-foreground transition-colors hover:bg-clay"
          >
            Ver la colección
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl">Esta página no ha cargado</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Algo ha fallado por nuestra parte. Prueba a recargar o vuelve al inicio.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-solid"
          >
            Reintentar
          </Button>
          <a href="/" className="border border-primary px-6 py-3 text-sm hover:bg-secondary">
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "author", content: `${FOUNDER}, By Maam` },
      { name: "theme-color", content: "#F5EDE3" },
      { name: "format-detection", content: "telephone=no" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "alternate", type: "application/json", href: "/products.json", title: "Catálogo By Maam (JSON)" },
      { rel: "alternate", type: "text/plain", href: "/llms.txt", title: "Resumen para asistentes de IA" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(ORGANIZATION_LD) },
      { type: "application/ld+json", children: JSON.stringify(WEBSITE_LD) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigating = useRouterState({ select: (state) => state.status === "pending" });

  // A stale page can request files that changed after an update; reload once to fetch fresh ones.
  useEffect(() => {
    const recover = (event: Event) => {
      const reason = (event as PromiseRejectionEvent).reason;
      const text = String(reason?.message ?? reason ?? "");
      if (event.type !== "vite:preloadError" && !/module script failed|dynamically imported module|Importing a module/i.test(text)) return;
      event.preventDefault();
      if (sessionStorage.getItem("bymaam-reloaded")) return;
      sessionStorage.setItem("bymaam-reloaded", "1");
      window.location.reload();
    };
    const clear = window.setTimeout(() => sessionStorage.removeItem("bymaam-reloaded"), 10000);
    window.addEventListener("vite:preloadError", recover);
    window.addEventListener("unhandledrejection", recover);
    return () => {
      window.clearTimeout(clear);
      window.removeEventListener("vite:preloadError", recover);
      window.removeEventListener("unhandledrejection", recover);
    };
  }, []);

  // Herramientas WebMCP para agentes del navegador (solo lectura, por detección de característica)
  const router = useRouter();
  useEffect(
    () =>
      registerWebMcpTools((to, search) =>
        router.navigate({ to, search: search ? Object.fromEntries(Object.entries(search).filter(([, v]) => v)) : {} } as never),
      ),
    [router],
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/*
        TODO (Marta): Google Analytics 4. Cuando tengas tu ID (G-XXXXXXXXXX),
        pégalo en GA4_ID (src/lib/site.ts) y carga el script gtag aquí,
        solo si el usuario aceptó cookies en el banner.
      */}
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <Preloader />
      <Header />
      <div className={`page-progress ${navigating ? "page-progress-active" : ""}`} role="progressbar" aria-label="Cargando página" aria-hidden={!navigating} />
      <main id="contenido">
        <div key={pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
      <MotionExperience pathname={pathname} />
      <Footer />
      <FloatingActions />
      {NEWSLETTER_ENDPOINT ? <ExitIntentPopup /> : null}
      <CookieBanner />
    </QueryClientProvider>
  );
}
