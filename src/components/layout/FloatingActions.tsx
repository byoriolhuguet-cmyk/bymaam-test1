import { useEffect, useState } from "react";
import { ArrowUp, Instagram } from "lucide-react";

import { INSTAGRAM_URL } from "@/lib/site";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Volver arriba"
        tabIndex={showTop ? 0 : -1}
        className={`fab bottom-5 left-5 h-11 w-11 border border-border bg-card text-clay hover:bg-cocoa hover:text-cream ${showTop ? "" : "pointer-events-none translate-y-3 opacity-0"}`}
      >
        <ArrowUp className="h-5 w-5" aria-hidden="true" strokeWidth={1.5} />
      </button>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener"
        aria-label="Escribir a By Maam por Instagram"
        className="fab bottom-5 right-5 h-14 w-14 bg-wine text-cream shadow-[var(--shadow-lift)] hover:-translate-y-1 hover:bg-cocoa"
      >
        <Instagram className="h-6 w-6" aria-hidden="true" strokeWidth={1.5} />
      </a>
    </>
  );
}
