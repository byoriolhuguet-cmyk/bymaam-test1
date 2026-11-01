import { createFileRoute, notFound } from "@tanstack/react-router";

import { GuidePage, guideHead } from "@/components/site/GuidePage";
import { getGuide } from "@/data/guides";

export const Route = createFileRoute("/guias/$slug")({
  loader: ({ params }) => {
    const guide = getGuide(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) =>
    loaderData
      ? guideHead(loaderData.guide)
      : { meta: [{ title: "Guía no encontrada | By Maam" }] },
  component: GuideRoute,
});

function GuideRoute() {
  const { guide } = Route.useLoaderData();
  return <GuidePage guide={guide} />;
}
