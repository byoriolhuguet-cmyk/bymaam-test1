import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { Prose } from "@/components/site/Prose";
import { CONTACT_EMAIL, LAST_UPDATED, SITE_URL } from "@/lib/site";

const TITLE = "Aviso legal | By Maam";
const DESC =
  "Titular, condiciones de uso, propiedad intelectual y responsabilidad del sitio web de By Maam, bolsos de piel hechos a mano.";

export const Route = createFileRoute("/aviso-legal")({
  head: () => seo({ title: TITLE, description: DESC, path: "/aviso-legal" }),
  component: AvisoLegal,
});

function AvisoLegal() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Aviso legal"
        lead="Quién está detrás de esta web y en qué condiciones puedes usarla."
        primary={{ href: `mailto:${CONTACT_EMAIL}`, label: "Contactar con la titular", external: true }}
      />

      <Prose>
        <h2>Titular del sitio</h2>
        <p>
          Marta Amarelo, que opera bajo la marca <strong>By Maam</strong>, con actividad artesanal
          en Galicia (España). Email de contacto:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Dirección web: {SITE_URL}.
        </p>
        <p className="text-xs">
          {/* TODO (Marta): completa con tus datos fiscales al darte de alta como autónoma */}
          [INSERTAR DATO REAL: NIF, domicilio fiscal y, si aplica, datos registrales]
        </p>

        <h2>Objeto</h2>
        <p>
          Esta web es un escaparate de marca. No incluye carrito ni pasarela de pago: las compras se
          formalizan en Vinted o directamente por Instagram o email.
        </p>

        <h2>Condiciones de uso</h2>
        <p>
          Al navegar por el sitio aceptas usarlo de forma lícita y no realizar acciones que puedan
          dañarlo o impedir su funcionamiento normal.
        </p>

        <h2>Propiedad intelectual</h2>
        <p>
          Los diseños, fotografías, textos, el logotipo y los modelos de bolso son propiedad de
          Marta Amarelo. No se permite su reproducción o uso comercial sin autorización por escrito.
        </p>

        <h2>Enlaces externos</h2>
        <p>
          El sitio enlaza a Vinted, Instagram, TikTok y Instagram. No soy responsable del contenido
          ni de las políticas de esas plataformas.
        </p>

        <h2>Responsabilidad</h2>
        <p>
          Cuido de que la información esté actualizada, pero pueden existir errores tipográficos o
          precios desactualizados. El precio válido es el publicado en el anuncio de Vinted o el
          confirmado por escrito.
        </p>

        <h2>Legislación aplicable</h2>
        <p>Este aviso se rige por la legislación española.</p>

        <p className="pt-6 text-xs uppercase tracking-[0.18em] text-sand-deep">
          Última actualización: {LAST_UPDATED}
        </p>
      </Prose>
    </>
  );
}
