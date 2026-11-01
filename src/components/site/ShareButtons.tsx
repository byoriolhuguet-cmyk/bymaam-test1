import { useState } from "react";
import { Check, Copy, Instagram, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { INSTAGRAM_URL, SITE_URL } from "@/lib/site";

/** Compartir en Instagram, X, Instagram y copiar enlace. */
export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = SITE_URL + path;

  const base =
    "inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-xs tracking-wide text-clay transition-colors hover:bg-secondary hover:text-foreground";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">Compartir</span>
      <a
        className={base}
        target="_blank"
        rel="noopener"
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        WhatsApp
      </a>
      <a
        className={base}
        target="_blank"
        rel="noopener"
        href={`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
      >
        X
      </a>
      <a className={base} target="_blank" rel="noopener" href={INSTAGRAM_URL}>
        <Instagram className="h-4 w-4" aria-hidden="true" />
        Instagram
      </a>
      <Button
        type="button"
        variant="outline"
        className={base}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
        {copied ? "Enlace copiado" : "Copiar enlace"}
      </Button>
    </div>
  );
}
