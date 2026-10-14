import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CONTACT_EMAIL, LAST_UPDATED, VINTED_URL, WHATSAPP_URL } from "@/lib/site";

const TITLE = "Preguntas frecuentes | By Maam";
const DESC =
  "Envíos, devoluciones, pedidos personalizados y formas de pago de los bolsos hechos a mano de By Maam.";

const FAQS = [
  {
    q: "¿Cómo puedo comprar un bolso de By Maam?",
    a: "Los bolsos disponibles están publicados en mi perfil de Vinted, donde la compra queda protegida por su sistema de pago. Si prefieres reservarlo directamente o quieres un modelo que no está publicado, escríbeme por Instagram a @bymaam_ y lo gestionamos entre las dos.",
  },
  {
    q: "¿Cuánto tarda en llegar mi pedido?",
    a: "Desde que haces el pedido, el encargo se hace en unos 5 días y después el envío tarda 3–4 días. Siempre te aviso con el número de seguimiento.",
  },
  {
    q: "¿Puedo devolver un bolso?",
    a: "Sí. Tienes 14 días naturales desde que lo recibes para devolverlo si no te convence, siempre que esté sin usar y con su embalaje. Los bolsos personalizados no admiten devolución por cambio de opinión, salvo defecto. Tienes el detalle en la página de devoluciones.",
  },
  {
    q: "¿Puedo pedir un bolso personalizado?",
    a: "Sí, es una parte importante de lo que hago. Puedes elegir un modelo existente en otro color o diseñar algo desde cero. Rellena el formulario de pedidos personalizados y te contesto en menos de 48 h.",
  },
  {
    q: "¿Qué métodos de pago aceptáis?",
    a: "A través de Vinted, los que ofrece su pasarela (tarjeta, Google Pay, Apple Pay, saldo). En pedidos directos o personalizados, transferencia o Bizum, con un anticipo del 50 % al empezar y el resto antes del envío.",
  },
  {
    q: "¿Cómo contacto con By Maam?",
    a: `Lo más rápido es Instagram (@bymaam_). También puedes escribirme a ${CONTACT_EMAIL} o por el formulario de contacto.`,
  },
];

export const Route = createFileRoute("/faq")({
  head: () =>
    seo({
      title: TITLE,
      description: DESC,
      path: "/faq",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Preguntas frecuentes"
        title="Todo lo que suelen preguntarme"
        lead="Y si no está aquí, escríbeme: contesto yo, no un bot."
        primary={{ href: WHATSAPP_URL, label: "Preguntar por Instagram", external: true }}
        secondary={{ href: VINTED_URL, label: "Ver la colección", external: true }}
      />

      <section className="section-y" aria-labelledby="faq-preguntas">
        <div className="container-brand max-w-3xl">
          <h2 id="faq-preguntas" className="sr-only">Preguntas y respuestas</h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="py-6 text-left font-display text-lg hover:no-underline md:text-xl">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-10 text-xs text-muted-foreground">Última actualización: {LAST_UPDATED}</p>
        </div>
      </section>
    </>
  );
}
