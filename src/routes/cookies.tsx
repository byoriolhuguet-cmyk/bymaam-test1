import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { Prose } from "@/components/site/Prose";
import { CONTACT_EMAIL, LAST_UPDATED } from "@/lib/site";

const TITLE = "Política de cookies | By Maam";
const DESC =
  "Qué cookies usa la web de By Maam, para qué sirven y cómo aceptarlas, rechazarlas o cambiar tu decisión cuando quieras.";

export const Route = createFileRoute("/cookies")({
  head: () => seo({ title: TITLE, description: DESC, path: "/cookies" }),
  component: Cookies,
});

function Cookies() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Política de cookies"
        lead="Esta web funciona perfectamente sin cookies de seguimiento. Solo se activan si tú lo aceptas."
      />

      <Prose>
        <h2>Qué es una cookie</h2>
        <p>
          Un archivo pequeño que se guarda en tu navegador cuando visitas una web y permite
          recordar información entre visitas.
        </p>

        <h2>Cookies que usa esta web</h2>
        <ul>
          <li>
            <strong>Técnicas (siempre activas):</strong> guardan tu decisión sobre el banner de
            cookies y el estado del aviso de la newsletter. No identifican a nadie y no requieren
            consentimiento.
          </li>
          <li>
            <strong>Analíticas (opcionales):</strong> Google Analytics 4, para saber qué páginas se
            visitan de forma agregada. Solo se cargan si pulsas «Aceptar».
          </li>
        </ul>

        <h2>Cómo cambiar tu decisión</h2>
        <p>
          Borra los datos de sitio de tu navegador para esta web y el banner volverá a aparecer, o
          escríbeme a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> si tienes cualquier
          duda. También puedes bloquear cookies desde la configuración de Chrome, Safari o Firefox.
        </p>

        <h2>Terceros</h2>
        <p>
          Si aceptas la analítica, Google trata esos datos según su propia política de privacidad.
          Los enlaces a Vinted, Instagram y TikTok abren sitios externos con sus propias cookies.
        </p>

        <p className="pt-6 text-xs uppercase tracking-[0.18em] text-sand-deep">
          Última actualización: {LAST_UPDATED}
        </p>
      </Prose>
    </>
  );
}
