import { createFileRoute } from "@tanstack/react-router";

import { HubPage, hubHead } from "@/components/site/HubPage";
import { HUBS } from "@/data/guides";

const HUB = HUBS.find((h) => h.path === "/fundas-portatil")!;

export const Route = createFileRoute("/fundas-portatil")({
  head: () => hubHead(HUB),
  component: () => <HubPage hub={HUB} />,
});
