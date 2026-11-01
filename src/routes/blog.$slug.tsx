import { createFileRoute, notFound } from "@tanstack/react-router";

import { BlogPostPage, blogPostHead } from "@/components/site/BlogPost";
import { loadPost } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await loadPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) =>
    loaderData
      ? blogPostHead(loaderData.post)
      : { meta: [{ title: "Artículo no encontrado | By Maam" }] },
  component: BlogPostRoute,
});

function BlogPostRoute() {
  const { post } = Route.useLoaderData();
  return <BlogPostPage post={post} />;
}
