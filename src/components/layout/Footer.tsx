import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Music2, ShoppingBag } from "lucide-react";

import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, LAST_UPDATED, NAV_LINKS, TIKTOK_URL, VINTED_URL } from "@/lib/site";

const SEALS = ["Hecho a mano en España", "Piel 100% real", "Envío con seguimiento", "Devoluciones aceptadas"];

const LEGAL = [
  { to: "/privacidad", label: "Política de privacidad" },
  { to: "/aviso-legal", label: "Aviso legal" },
  { to: "/cookies", label: "Política de cookies" },
  { to: "/devoluciones", label: "Política de devoluciones" },
] as const;

const social =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-clay transition-colors duration-300 hover:border-wine hover:bg-wine hover:text-cream";

export function Footer() {
  return (
    <footer id="pie" className="overflow-hidden border-t border-border bg-card" aria-label="Pie de página">
      <div className="container-brand grid gap-12 pb-12 pt-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl leading-tight md:text-4xl">
            Hecho a mano,
            <br />
            <em className="text-wine">pieza a pieza.</em>
          </p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Bolsos diseñados y cosidos a mano por Marta Amarelo. Ediciones limitadas, hechas de una en una.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" aria-label="Instagram de By Maam" className={social}>
              <Instagram className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={1.5} />
            </a>
            <a href={TIKTOK_URL} target="_blank" rel="noopener" aria-label="TikTok de By Maam" className={social}>
              <Music2 className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={1.5} />
            </a>
            <a href={VINTED_URL} target="_blank" rel="noopener" aria-label="Perfil de By Maam en Vinted" className={social}>
              <ShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <nav aria-label="Enlaces del sitio">
          <h2 className="eyebrow">Navegar</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="link-draw text-foreground">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow">Contacto</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="link-draw inline-flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" strokeWidth={1.5} />
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="link-draw">
                Instagram {INSTAGRAM_HANDLE}
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Información legal">
          <h2 className="eyebrow">Legal</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {LEGAL.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="link-draw text-foreground">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <ul className="container-brand flex flex-wrap justify-center gap-x-8 gap-y-3 py-6 text-[0.68rem] uppercase tracking-[0.2em] text-clay">
          {SEALS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="container-brand flex flex-col items-center justify-between gap-2 border-t border-border py-5 text-xs text-muted-foreground sm:flex-row">
        <p>© 2026 By Maam. Todos los derechos reservados.</p>
        <p>Última actualización: {LAST_UPDATED}</p>
      </div>

      <div className="container-brand" aria-hidden="true">
        <p className="footer-mark">by maam</p>
      </div>
    </footer>
  );
}
