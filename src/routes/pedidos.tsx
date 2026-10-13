import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { FORMSPREE_ORDERS, CONTACT_EMAIL, WHATSAPP_URL } from "@/lib/site";

const TITLE = "Pedidos personalizados | By Maam";
const DESC =
  "Encarga tu bolso a medida: modelo, color y detalles. Marta responde en menos de 48 h por email o Instagram.";

export const Route = createFileRoute("/pedidos")({
  head: () => seo({ title: TITLE, description: DESC, path: "/pedidos" }),
  component: PedidosPage,
});

const STEPS = ["Tus datos", "Tu bolso", "Detalles"];

const inputCls =
  "w-full border border-input bg-card px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-sand-deep";
const labelCls = "block text-xs uppercase tracking-[0.16em] text-sand-deep";

function PedidosPage() {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tipo: "",
    color: "",
    presupuesto: "",
    mensaje: "",
    privacidad: false,
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const stepValid =
    step === 0
      ? form.nombre.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())
      : step === 1
        ? form.tipo !== ""
        : form.privacidad;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stepValid) {
      setError("Acepta la política de privacidad para poder enviar el pedido.");
      return;
    }
    if (!FORMSPREE_ORDERS) {
      setError("El formulario aún no está conectado. Cuéntame tu idea por Instagram mientras tanto.");
      return;
    }
    setSending(true);
    setError("");
    try {
      // TODO (Marta): pega tu ID de Formspree en FORMSPREE_ORDERS (src/lib/site.ts)
      const res = await fetch(FORMSPREE_ORDERS, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("bad response");
      setSent(true);
    } catch {
      setError(
        "No se ha podido enviar. Escríbeme por Instagram o a " + CONTACT_EMAIL + " y lo vemos.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Pedidos personalizados"
        title="Cuéntame el bolso que tienes en la cabeza"
        lead="Un modelo existente en otro color o algo hecho desde cero. Te contesto en menos de 48 h, siempre yo."
        primary={{ href: WHATSAPP_URL, label: "Prefiero Instagram", external: true }}
      />

      <section className="section-y">
        <div className="container-brand max-w-2xl">
          {sent ? (
            <div className="border border-border bg-card p-10 text-center">
              <p className="rule-label">Pedido recibido</p>
              <h2 className="mt-6 text-3xl">
                ¡Gracias! Marta revisará tu pedido y te contestará en menos de 48h por email o
                Instagram.
              </h2>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener"
                className="mt-8 inline-flex border border-primary bg-primary px-7 py-3.5 text-sm text-primary-foreground transition-colors hover:bg-clay"
              >
                Adelantar la conversación por Instagram
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              {/* Barra de progreso */}
              <div className="mb-10">
                <div className="flex justify-between text-[0.7rem] uppercase tracking-[0.16em] text-sand-deep">
                  {STEPS.map((s, i) => (
                    <span key={s} className={i <= step ? "text-foreground" : undefined}>
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-3 h-px w-full bg-border">
                  <div
                    className="h-px bg-primary transition-all duration-300"
                    style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  />
                </div>
              </div>

              {step === 0 && (
                <div key="step-0" className="page-enter space-y-6">
                  <div>
                    <label className={labelCls} htmlFor="nombre">
                      Nombre completo
                    </label>
                    <input
                      id="nombre"
                      className={`${inputCls} mt-2`}
                      value={form.nombre}
                      onChange={(e) => set("nombre", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`${inputCls} mt-2`}
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="telefono">
                      Teléfono (opcional)
                    </label>
                    <input
                      id="telefono"
                      type="tel"
                      className={`${inputCls} mt-2`}
                      value={form.telefono}
                      onChange={(e) => set("telefono", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div key="step-1" className="page-enter space-y-6">
                  <div>
                    <label className={labelCls} htmlFor="tipo">
                      ¿Qué tipo de bolso buscas?
                    </label>
                    <select
                      id="tipo"
                      className={`${inputCls} mt-2`}
                      value={form.tipo}
                      onChange={(e) => set("tipo", e.target.value)}
                      required
                    >
                      <option value="">Elige una opción</option>
                      <option>Modelo existente en otro color</option>
                      <option>Diseño completamente personalizado</option>
                      <option>No estoy segura, quiero que me asesores</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="color">
                      Color preferido
                    </label>
                    <input
                      id="color"
                      className={`${inputCls} mt-2`}
                      placeholder="Coñac, negro, camel, chocolate…"
                      value={form.color}
                      onChange={(e) => set("color", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="presupuesto">
                      Presupuesto aproximado
                    </label>
                    <select
                      id="presupuesto"
                      className={`${inputCls} mt-2`}
                      value={form.presupuesto}
                      onChange={(e) => set("presupuesto", e.target.value)}
                      required
                    >
                      <option value="">Elige un rango</option>
                      <option>30-40 euros</option>
                      <option>40-50 euros</option>
                      <option>+ 50 euros</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div key="step-2" className="page-enter space-y-6">
                  <div>
                    <label className={labelCls} htmlFor="mensaje">
                      Mensaje adicional
                    </label>
                    <textarea
                      id="mensaje"
                      rows={6}
                      className={`${inputCls} mt-2 resize-y`}
                      placeholder="Medidas, referencias, para cuándo lo necesitas…"
                      value={form.mensaje}
                      onChange={(e) => set("mensaje", e.target.value)}
                    />
                  </div>
                  <label className="flex items-start gap-3 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-[var(--color-cocoa)]"
                      checked={form.privacidad}
                      onChange={(e) => set("privacidad", e.target.checked)}
                      required
                    />
                    <span>
                      He leído y acepto la política de privacidad y el tratamiento de mis datos para
                      responder a este pedido.
                    </span>
                  </label>
                </div>
              )}

              {error && <p role="alert" className="mt-6 text-sm text-wine">{error}</p>}

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                {step > 0 && (
                  <Button
                    type="button"
                    onClick={() => { setError(""); setStep((s) => s - 1); }}
                    variant="outline" className="btn-ghost h-auto"
                  >
                    Atrás
                  </Button>
                )}
                {step < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (!stepValid) {
                        setError(
                          step === 0
                            ? "Escribe tu nombre y un email válido para continuar."
                            : "Elige el tipo de bolso para continuar.",
                        );
                        return;
                      }
                      setError("");
                      setStep((s) => s + 1);
                    }}
                    className="btn-solid h-auto"
                  >
                    Continuar
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={sending}
                    className="btn-solid h-auto"
                  >
                    {sending && <span className="loading-spinner" aria-hidden="true" />}
                    {sending ? "Enviando…" : "Enviar pedido"}
                  </Button>
                )}
              </div>
            </form>
          )}

          <div className="mt-14 border-t border-border pt-10">
            <p className="text-sm text-muted-foreground">
              ¿Prefieres hablarlo directamente? Escríbeme por Instagram →
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex border border-primary px-7 py-3.5 text-sm transition-colors hover:bg-secondary"
            >
              Abrir Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
