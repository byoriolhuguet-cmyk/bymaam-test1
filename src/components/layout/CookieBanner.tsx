import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const KEY = "bymaam-cookies";

/** Banner de cookies conforme al RGPD: aceptar / rechazar con el mismo peso. */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (value: "accepted" | "rejected") => {
    localStorage.setItem(KEY, value);
    setVisible(false);
    // TODO: si activas Google Analytics 4, inicialízalo solo cuando value === "accepted".
  };

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card"
    >
      <div className="container-brand flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Uso cookies propias necesarias para que la web funcione y, si lo aceptas, cookies de
          analítica para saber qué páginas se visitan. Puedes cambiar de opinión cuando quieras.{" "}
          <Link to="/cookies" className="underline underline-offset-4 hover:text-foreground">
            Política de cookies
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            onClick={() => decide("rejected")}
            variant="outline" className="btn-ghost h-auto"
          >
            Rechazar
          </Button>
          <Button
            type="button"
            onClick={() => decide("accepted")}
            className="btn-solid h-auto"
          >
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}
