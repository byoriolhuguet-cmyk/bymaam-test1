import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { VINTED_URL, WHATSAPP_URL } from "@/lib/site";

const TITLE = "Sobre Marta Amarelo, fundadora de By Maam";
const DESC =
  "By Maam nació de las manos de Marta Amarelo, una chica de 21 años y estudiante de medicina. Cada bolso lo diseña y lo cose ella, pieza a pieza.";

export const Route = createFileRoute("/sobre-mi")({
  head: () => seo({ title: TITLE, description: DESC, path: "/sobre-mi" }),
  component: SobrePage,
});

const VALUES = [
  {
    title: "Artesanía",
    text: "Ningún bolso pasa por una máquina industrial. Patrón, corte y costura salen de la misma mesa.",
  },
  {
    title: "Sostenibilidad",
    text: "Producción bajo pedido. Se hace lo que se vende, no al revés.",
  },
  {
    title: "Edición limitada",
    text: "Series muy cortas. Si un color se agota, normalmente no vuelve igual.",
  },
];

function SobrePage() {
  return (
    <>
      <PageHeader
        eyebrow="Sobre mí"
        title="No es una fábrica. Es una persona y una mesa de trabajo."
        lead="By Maam es el proyecto de Marta Amarelo: bolsos cosidos a mano, uno a uno."
        primary={{ href: VINTED_URL, label: "Ver la colección", external: true }}
        secondary={{ href: WHATSAPP_URL, label: "Hablar con Marta", external: true }}
      />

      <section className="section-y">
        <div className="container-brand grid gap-14 md:grid-cols-2 md:items-center">
          <div>
            {/* Foto real de Marta aportada por la marca */}
            <img
              src="/images/brand/marta-amarelo.webp"
              srcSet="/images/brand/marta-amarelo-700.webp 700w, /images/brand/marta-amarelo.webp 894w"
              sizes="(min-width: 768px) 46vw, 92vw"
              width={894}
              height={878}
              alt="Marta Amarelo, fundadora de By Maam"
              className="w-full border border-border object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div>
            <p className="rule-label">La historia</p>
            <h2 className="mt-6 text-3xl md:text-4xl">Marta Amarelo, 21 años, Galicia</h2>
            <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
              <p>
                By Maam nació de las manos de Marta Amarelo, una chica de 21 años que
                estudia medicina. Su curiosidad por la moda y su pasión por el trabajo manual la
                llevaron a crear una marca donde cada bolso es único, cosido pieza a pieza.
              </p>
              <p>
                No es una fábrica. Es una persona, una mesa de trabajo y muchas horas de dedicación.
              </p>
              <p>
                Lo que empezó como una forma de desconectar entre exámenes se convirtió en algo
                serio el día que el primer bolso salió de casa en manos de otra persona.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-brand">
          <p className="rule-label">Valores</p>
          <h2 className="mt-6 max-w-2xl text-3xl md:text-4xl">En qué no se transige</h2>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <div key={v.title} className="border-t border-border pt-6">
                <span className="text-xs tracking-[0.2em] text-sand-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-2xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
