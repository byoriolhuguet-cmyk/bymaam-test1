import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { Prose } from "@/components/site/Prose";
import { CONTACT_EMAIL, LAST_UPDATED, WHATSAPP_URL } from "@/lib/site";

const TITLE = "Política de devoluciones | By Maam";
const DESC =
  "Plazos, condiciones y pasos para devolver o cambiar un bolso de By Maam. Explicado claro, sin letra pequeña.";

export const Route = createFileRoute("/devoluciones")({
  head: () => seo({ title: TITLE, description: DESC, path: "/devoluciones" }),
  component: Devoluciones,
});

function Devoluciones() {
  return (
    <>
      <PageHeader
        eyebrow="Devoluciones"
        title="Si no es tu bolso, se devuelve"
        lead="Catorce días para decidirlo con calma. Sin justificaciones raras ni formularios interminables."
        primary={{ href: WHATSAPP_URL, label: "Iniciar una devolución", external: true }}
        secondary={{ href: "/faq", label: "Ver preguntas frecuentes" }}
      />

      <Prose>
        <h2>Plazo</h2>
        <p>
          Tienes <strong>14 días naturales</strong> desde que recibes el bolso para decirme que
          quieres devolverlo, y otros 14 para enviármelo de vuelta.
        </p>

        <h2>Condiciones</h2>
        <ul>
          <li>El bolso debe estar sin usar, sin olores y sin marcas de uso.</li>
          <li>Con su bolsa de tela y el embalaje original.</li>
          <li>
            Los <strong>pedidos personalizados</strong> no admiten devolución por cambio de opinión,
            porque se hacen desde cero para ti. Si llega con un defecto, por supuesto lo soluciono.
          </li>
          <li>
            Las compras hechas a través de Vinted se gestionan por su propio sistema de protección
            al comprador.
          </li>
        </ul>

        <h2>Cómo se hace, paso a paso</h2>
        <ol>
          <li>
            Me escribes por Instagram o a {CONTACT_EMAIL} indicando tu pedido y el motivo (una línea
            basta).
          </li>
          <li>Te confirmo la dirección de devolución en menos de 24 h.</li>
          <li>Envías el bolso bien protegido, con seguimiento.</li>
          <li>Lo reviso el mismo día que llega.</li>
          <li>
            Te devuelvo el importe por el mismo medio de pago en un máximo de{" "}
            <strong>7 días</strong> desde la recepción.
          </li>
        </ol>

        <h2>Gastos de envío</h2>
        <p>
          El envío de vuelta lo asume la clienta, salvo que el bolso tenga un defecto o me haya
          equivocado yo con el pedido: en ese caso lo pago íntegro.
        </p>

        <h2>Cambios</h2>
        <p>
          Si prefieres otro color o modelo en lugar del reembolso, dímelo y lo reservo mientras
          llega el envío de vuelta.
        </p>

        <h2>Defectos y garantía</h2>
        <p>
          Cada bolso está cosido y revisado a mano. Si una costura cede o un herraje falla con un
          uso normal, lo reparo sin coste durante los dos primeros años.
        </p>

        <p className="pt-6 text-xs uppercase tracking-[0.18em] text-sand-deep">
          Última actualización: {LAST_UPDATED}
        </p>
      </Prose>
    </>
  );
}
