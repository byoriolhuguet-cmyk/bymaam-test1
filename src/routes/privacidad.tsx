import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { Prose } from "@/components/site/Prose";
import { CONTACT_EMAIL, LAST_UPDATED } from "@/lib/site";

const TITLE = "Política de privacidad | By Maam";
const DESC =
  "Qué datos recojo en By Maam, para qué los uso, cuánto los guardo y cómo puedes ejercer tus derechos. Conforme al RGPD y la LOPDGDD.";

export const Route = createFileRoute("/privacidad")({
  head: () => seo({ title: TITLE, description: DESC, path: "/privacidad" }),
  component: Privacidad,
});

function Privacidad() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Política de privacidad"
        lead="Recojo los datos mínimos para contestarte y enviarte tu bolso. Nada más."
        primary={{ href: `mailto:${CONTACT_EMAIL}`, label: "Escribir sobre mis datos", external: true }}
      />

      <Prose>
        <h2>Responsable</h2>
        <p>
          Marta Amarelo (By Maam), marca personal con actividad en Barcelona (España). Contacto:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <p className="text-xs">
          {/* TODO (Marta): añade aquí tu NIF y domicilio fiscal cuando te des de alta */}
          [INSERTAR DATO REAL: NIF y domicilio fiscal del responsable]
        </p>

        <h2>Qué datos recojo</h2>
        <ul>
          <li>
            <strong>Formulario de contacto y de pedidos:</strong> nombre, email, teléfono
            (opcional) y el contenido del mensaje.
          </li>
          <li>
            <strong>Newsletter:</strong> tu email.
          </li>
          <li>
            <strong>Navegación:</strong> datos estadísticos anónimos, solo si aceptas las cookies
            de analítica.
          </li>
        </ul>

        <h2>Para qué los uso</h2>
        <ul>
          <li>Contestar tu consulta y preparar tu pedido personalizado.</li>
          <li>Enviarte novedades y avisos de stock, si te has suscrito.</li>
          <li>Entender qué páginas se visitan, de forma agregada.</li>
        </ul>

        <h2>Base legal</h2>
        <p>
          Tu consentimiento al enviar el formulario o suscribirte, y la ejecución del pedido cuando
          me compras un bolso.
        </p>

        <h2>Cuánto tiempo los guardo</h2>
        <p>
          Los mensajes, mientras dure la conversación y hasta un año después. Los datos de
          suscripción, hasta que te des de baja. Los datos de pedidos, el tiempo que exija la
          normativa fiscal.
        </p>

        <h2>Con quién los comparto</h2>
        <p>
          Solo con los proveedores necesarios para que la web funcione: el servicio de formularios,
          la plataforma de email marketing, el hosting y, en su caso, la analítica. No vendo ni
          cedo datos a terceros.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Puedes pedirme acceso, rectificación, supresión, limitación, portabilidad u oposición
          escribiendo a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Contesto en menos
          de 30 días. También puedes reclamar ante la Agencia Española de Protección de Datos
          (<a href="https://www.aepd.es" target="_blank" rel="noopener">aepd.es</a>).
        </p>

        <p className="pt-6 text-xs uppercase tracking-[0.18em] text-sand-deep">
          Última actualización: {LAST_UPDATED}
        </p>
      </Prose>
    </>
  );
}
