import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Newsletter } from "@/components/site/Newsletter";
import { Button } from "@/components/ui/button";

const KEY = "bymaam-exit-intent";

/** Exit intent: SOLO desktop (puntero fino). En móvil nunca se muestra. */
export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;

    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setOpen(true);
        sessionStorage.setItem(KEY, "1");
        document.removeEventListener("mouseout", onLeave);
      }
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] hidden items-center justify-center bg-cocoa/40 p-6 lg:flex">
      <div className="card-soft relative w-full max-w-lg p-10">
        <Button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar"
          variant="ghost" size="icon" className="absolute right-4 top-4 text-clay transition-colors hover:text-foreground"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </Button>
        <p className="rule-label">Antes de irte</p>
        <h2 className="mt-5 text-3xl">¿Te vas sin ver la colección?</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Suscríbete y llévate un 10% en tu primer pedido. Te aviso también cuando saco una edición
          nueva, que suelen durar poco.
        </p>
        <div className="mt-7">
          <Newsletter />
        </div>
      </div>
    </div>
  );
}
