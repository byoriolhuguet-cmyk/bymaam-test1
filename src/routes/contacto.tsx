import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import {
  CONTACT_EMAIL,
  FORMSPREE_CONTACT,
  INSTAGRAM_URL,
  TIKTOK_URL,
  WHATSAPP_URL,
} from "@/lib/site";

const TITLE = "Contacto | By Maam";
const DESC =
  "Escribe a Marta Amarelo: dudas sobre un bolso o colaboraciones. Instagram, email y TikTok de By Maam.";

/** WebMCP declarativo: los agentes del navegador pueden rellenar este formulario como herramienta (el envío lo confirma la persona). */
const WEBMCP_FORM = {
  toolname: "escribir_a_marta",
  tooldescription:
    "Envía un mensaje a Marta Amarelo (By Maam): dudas sobre una pieza, colaboraciones u otros temas. Campos: nombre, email, asunto y mensaje.",
} as Record<string, string>;

export const Route = createFileRoute("/contacto")({
  head: () => seo({ title: TITLE, description: DESC, path: "/contacto" }),
  component: ContactoPage,
});

const inputCls =
  "w-full border border-input bg-card px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-sand-deep";
const labelCls = "block text-xs uppercase tracking-[0.16em] text-sand-deep";

function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nombre: "", email: "", asunto: "", mensaje: "" });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email) || !form.mensaje.trim()) {
      setError("Revisa el nombre, el email y el mensaje.");
      return;
    }
    if (!FORMSPREE_CONTACT) {
      setError("El formulario aún no está conectado. Escríbeme por Instagram mientras tanto.");
      return;
    }
    setSending(true);
    setError("");
    try {
      // TODO (Marta): pega tu ID de Formspree en FORMSPREE_CONTACT (src/lib/site.ts)
      const res = await fetch(FORMSPREE_CONTACT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("bad response");
      setSent(true);
    } catch {
      setError(`No se ha podido enviar. Escríbeme a ${CONTACT_EMAIL} o por Instagram.`);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title="Escríbeme y te contesto yo"
        lead="Detrás de By Maam no hay atención al cliente: hay Marta. Suelo responder el mismo día."
        primary={{ href: WHATSAPP_URL, label: "Escribir por Instagram", external: true }}
      />

      <section className="section-y">
        <div className="container-brand grid gap-14 md:grid-cols-[1.2fr_1fr]">
          <div>
            {sent ? (
              <div className="border border-border bg-card p-10">
                <p className="rule-label">Mensaje enviado</p>
                <h2 className="mt-6 text-3xl">Gracias, te respondo en menos de 48 h.</h2>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="space-y-6"
                noValidate
                {...WEBMCP_FORM}
              >
                <div>
                  <label className={labelCls} htmlFor="c-nombre">
                    Nombre
                  </label>
                  <input
                    id="c-nombre"
                    name="nombre"
                    autoComplete="name"
                    className={`${inputCls} mt-2`}
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="c-email">
                    Email
                  </label>
                  <input
                    id="c-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    className={`${inputCls} mt-2`}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="c-asunto">
                    Asunto
                  </label>
                  <select
                    id="c-asunto"
                    name="asunto"
                    className={`${inputCls} mt-2`}
                    value={form.asunto}
                    onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                  >
                    <option value="">Elige una opción</option>
                    <option>Duda sobre producto</option>
                    <option>Colaboración</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="c-mensaje">
                    Mensaje
                  </label>
                  <textarea
                    id="c-mensaje"
                    name="mensaje"
                    rows={6}
                    className={`${inputCls} mt-2 resize-y`}
                    value={form.mensaje}
                    onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                    required
                  />
                </div>
                {error && <p role="alert" className="text-sm text-wine">{error}</p>}
                <Button
                  type="submit"
                  disabled={sending}
                  className="btn-solid h-auto"
                >
                  {sending && <span className="loading-spinner" aria-hidden="true" />}
                  {sending ? "Enviando…" : "Enviar mensaje"}
                </Button>
              </form>
            )}
          </div>

          <aside className="border-t border-border pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
            <h2 className="rule-label">Directo</h2>
            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-clay hover:text-foreground">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener"
                  className="text-clay hover:text-foreground"
                >
                  Instagram @bymaam_
                </a>
              </li>
              <li>
                <a
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noopener"
                  className="text-clay hover:text-foreground"
                >
                  TikTok @bymaam_
                </a>
              </li>
            </ul>
            <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
              By Maam es una marca personal y trabaja desde casa, así que no hay tienda física ni
              dirección de visita.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
