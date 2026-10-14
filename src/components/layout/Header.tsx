import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Instagram, ShoppingBag } from "lucide-react";

import { Wordmark } from "@/components/brand/Logo";
import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  NAV_LINKS,
  TIKTOK_URL,
  VINTED_URL,
} from "@/lib/site";

/**
 * Cabecera fija y siempre visible (estilo Miu Miu): transparente arriba y sólida al bajar.
 * En la portada su logo aparece cuando el logo gigante termina de encogerse (html[data-logo-docked]).
 * Menú a pantalla completa con cortina vino y enlaces que suben uno a uno.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const burgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 24);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Cerrar al navegar
  useEffect(() => setOpen(false), [pathname]);

  // Escape, foco y contenido inerte mientras el menú está abierto
  useEffect(() => {
    const main = document.getElementById("contenido");
    const footer = document.getElementById("pie");
    main?.toggleAttribute("inert", open);
    footer?.toggleAttribute("inert", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as Node;
      if (overlayRef.current?.contains(target) || burgerRef.current?.contains(target)) return;
      overlayRef.current?.querySelector<HTMLElement>("a")?.focus();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocusIn);
    const t = window.setTimeout(
      () => overlayRef.current?.querySelector<HTMLElement>("a")?.focus(),
      450,
    );
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocusIn);
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    };
  }, [open]);

  return (
    <>
      <header className="site-header" data-scrolled={scrolled} data-menu={open}>
        <div className="container-brand grid h-full grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex items-center gap-6">
            <button
              ref={burgerRef}
              type="button"
              className="menu-burger"
              aria-expanded={open}
              aria-controls="menu-principal"
              onClick={() => setOpen((v) => !v)}
            >
              <i aria-hidden="true" />
              <span>{open ? "Cerrar" : "Menú"}</span>
            </button>
            <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegación principal">
              <Link to="/coleccion" className="nav-link">
                Colección
              </Link>
              <Link to="/sobre-mi" className="nav-link">
                Sobre mí
              </Link>
              <Link to="/pedidos" className="nav-link">
                Pedidos
              </Link>
            </nav>
          </div>

          <Link to="/" aria-label="By Maam, inicio" className="justify-self-center">
            <Wordmark size={30} />
          </Link>

          <div className="flex items-center justify-end gap-2">
            <a
              href={VINTED_URL}
              target="_blank"
              rel="noopener"
              aria-label="Ver la colección en Vinted"
              className="nav-link hidden items-center gap-2 sm:inline-flex"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" strokeWidth={1.5} />
              Vinted
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener"
              aria-label="Escribir por Instagram"
              className="btn-solid btn-sm h-10"
            >
              <Instagram className="h-[17px] w-[17px]" aria-hidden="true" strokeWidth={1.5} />
              <span className="hidden sm:inline">Instagram</span>
            </a>
          </div>
        </div>
      </header>

      <div
        id="menu-principal"
        ref={overlayRef}
        className="menu-overlay"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
      >
        <nav aria-label="Menú a pantalla completa" className="menu-links">
          {NAV_LINKS.map((l, i) => (
            <Link key={l.to} to={l.to} className="menu-link" onClick={() => setOpen(false)}>
              <span style={{ ["--i" as string]: i }}>
                <small>{String(i + 1).padStart(2, "0")}</small>
                {l.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="menu-foot">
          <p className="max-w-xs leading-relaxed opacity-80">
            Bolsos de piel hechos a mano por Marta Amarelo en Barcelona. Ediciones limitadas.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a className="link-draw" href={INSTAGRAM_URL} target="_blank" rel="noopener">
                Instagram {INSTAGRAM_HANDLE}
              </a>
            </li>
            <li>
              <a className="link-draw" href={TIKTOK_URL} target="_blank" rel="noopener">
                TikTok
              </a>
            </li>
            <li>
              <a className="link-draw" href={VINTED_URL} target="_blank" rel="noopener">
                Vinted
              </a>
            </li>
            <li>
              <a className="link-draw" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
