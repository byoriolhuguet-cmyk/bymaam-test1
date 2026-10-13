import { useState, type FormEvent } from "react";

import { NEWSLETTER_ENDPOINT } from "@/lib/site";
import { Button } from "@/components/ui/button";

/**
 * Newsletter.
 * TODO (Marta): crea una lista en Mailchimp o Brevo y pega la URL de acción
 * en NEWSLETTER_ENDPOINT (src/lib/site.ts). Sin endpoint, el formulario valida
 * y confirma en pantalla, pero no guarda el email en ningún sitio.
 */
export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState("error");
      return;
    }
    if (!NEWSLETTER_ENDPOINT) {
      setState("error");
      return;
    }
    setState("sending");
    try {
      const body = new FormData();
      body.append("EMAIL", email.trim());
      const response = await fetch(NEWSLETTER_ENDPOINT, { method: "POST", body });
      if (!response.ok) throw new Error("subscription failed");
      setState("ok");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <p className={compact ? "text-sm text-sand-deep" : "font-display text-2xl"}>
        Gracias. Te escribo pronto con tu código de bienvenida.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md" noValidate>
      <label htmlFor={compact ? "nl-compact" : "nl-main"} className="sr-only">
        Tu email
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={compact ? "nl-compact" : "nl-main"}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="tu@email.com"
          className="min-w-0 flex-1 rounded-full border border-input bg-card px-5 py-3.5 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-sand-deep focus:shadow-[var(--shadow-soft)]"
        />
        <Button
          type="submit"
          disabled={state === "sending"}
          className="btn-solid h-auto"
        >
          {state === "sending" && <span className="loading-spinner" aria-hidden="true" />}
          {state === "sending" ? "Enviando…" : "Suscribirme"}
        </Button>
      </div>
      {state === "error" && (
        <p role="alert" className="mt-2 text-sm text-wine">
          {!NEWSLETTER_ENDPOINT ? "La suscripción aún no está disponible. Vuelve pronto." : "Revisa el email o inténtalo de nuevo más tarde."}
        </p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        Sin spam. Solo nuevos drops y avisos de stock. Puedes darte de baja cuando quieras.
      </p>
    </form>
  );
}
