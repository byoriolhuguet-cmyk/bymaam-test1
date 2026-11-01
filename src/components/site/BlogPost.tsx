import { Link, useRouter } from "@tanstack/react-router";
import type { MouseEvent } from "react";

import { Action, PageHeader } from "@/components/site/PageHeader";
import { ProductTile } from "@/components/site/ProductTile";
import { getProduct, type Product } from "@/data/products";
import { formatDate, relatedPosts, type Post, type PostMeta } from "@/lib/blog";
import { breadcrumbLd, seo } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const AUTHOR = "Redacción By Maam";

const postProducts = (post: PostMeta) =>
  post.products.map((s) => getProduct(s)).filter((p): p is Product => Boolean(p));

/**
 * Cabecera SEO de un artículo: BlogPosting completo, FAQPage (las preguntas que responde) y migas.
 * La "respuesta rápida" va como abstract: es el párrafo que citan los buscadores de IA.
 */
export function blogPostHead(post: Post) {
  const url = `${SITE_URL}${post.path}`;
  const cover = postProducts(post)[0];
  const image = cover ? `${SITE_URL}${cover.image}` : undefined;
  return seo({
    title: `${post.title} | By Maam`,
    description: post.description,
    path: post.path,
    type: "article",
    ...(image ? { image, imageAlt: cover!.alt } : {}),
    jsonLd: [
      breadcrumbLd([
        { name: "Inicio", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: post.path },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${url}#articulo`,
        headline: post.title,
        description: post.description,
        abstract: post.tldr,
        url,
        mainEntityOfPage: url,
        inLanguage: "es-ES",
        datePublished: post.date,
        dateModified: post.updated,
        articleSection: post.typeLabel,
        keywords: [post.keyword, ...post.keywords].join(", "),
        wordCount: post.words,
        timeRequired: `PT${post.readingMinutes}M`,
        ...(image ? { image } : {}),
        author: { "@type": "Organization", name: AUTHOR, url: `${SITE_URL}/blog` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        isPartOf: { "@type": "Blog", "@id": `${SITE_URL}/blog#blog`, name: `Blog de ${SITE_NAME}` },
        about: post.keyword,
        mentions: postProducts(post).map((p) => ({
          "@type": "Product",
          name: `${p.name} ${p.color}`,
          url: `${SITE_URL}/coleccion/${p.slug}`,
        })),
        ...(post.sources.length
          ? {
              citation: post.sources.map((s) => ({
                "@type": "CreativeWork",
                name: s.name,
                url: s.url,
              })),
            }
          : {}),
      },
      ...(post.faq.length
        ? [
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: post.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  });
}

export function BlogPostPage({ post }: { post: Post }) {
  const router = useRouter();
  const products = postProducts(post);
  const related = relatedPosts(post);

  /** Los enlaces internos del cuerpo navegan dentro de la web, sin recargar la página. */
  const onBodyClick = (event: MouseEvent<HTMLDivElement>) => {
    const a = (event.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href");
    if (!a || !href?.startsWith("/") || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    void router.navigate({ href });
  };

  return (
    <>
      <PageHeader
        title={post.title}
        lead={post.description}
        crumbs={[
          { name: "Inicio", to: "/" },
          { name: "Blog", to: "/blog" },
        ]}
      />

      <div className="container-brand pb-24 md:pb-32">
        <p className="post-meta">
          <span>{post.typeLabel}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readingMinutes} min de lectura</span>
          <span>Por {AUTHOR}</span>
        </p>

        <div className="mt-10 grid gap-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="En este artículo" className="post-toc">
            <p className="font-display text-lg text-foreground">En este artículo</p>
            <ol>
              {post.toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`}>{t.text}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="min-w-0" aria-labelledby="post-tldr">
            <aside className="post-tldr" aria-label="Respuesta rápida">
              <p id="post-tldr" className="font-display text-xl text-foreground">
                Respuesta rápida
              </p>
              <p className="mt-3 leading-relaxed">{post.tldr}</p>
            </aside>

            <div
              className="post-body"
              onClick={onBodyClick}
              dangerouslySetInnerHTML={{ __html: post.html }}
            />

            {products.length > 0 && (
              <section className="mt-20 border-t border-border pt-12" aria-labelledby="post-piezas">
                <h2 id="post-piezas" className="text-3xl leading-tight md:text-4xl">
                  Las piezas de este artículo
                </h2>
                <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                  {products.slice(0, 3).map((p) => (
                    <ProductTile
                      key={p.slug}
                      product={p}
                      sizes="(min-width: 1280px) 22vw, (min-width: 640px) 40vw, 92vw"
                    />
                  ))}
                </div>
                <div className="mt-12 flex flex-col gap-3 sm:flex-row">
                  <Action action={{ href: "/coleccion", label: "Ver toda la colección" }} />
                  <Action
                    action={{ href: "/pedidos", label: "Encargar un modelo a medida" }}
                    variant="ghost"
                  />
                </div>
              </section>
            )}

            {related.length > 0 && (
              <section className="mt-20 border-t border-border pt-12" aria-labelledby="post-mas">
                <h2 id="post-mas" className="text-3xl leading-tight md:text-4xl">
                  Sigue leyendo
                </h2>
                <ul className="mt-6 divide-y divide-border border-y border-border">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link to="/blog/$slug" params={{ slug: r.slug }} className="block py-6">
                        <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {r.typeLabel}, {formatDate(r.date)}
                        </span>
                        <span className="mt-2 block font-display text-xl md:text-2xl">
                          {r.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm">
                  <Link to="/blog" className="link-draw tap">
                    Todos los artículos del blog
                  </Link>
                </p>
              </section>
            )}
          </article>
        </div>
      </div>
    </>
  );
}
