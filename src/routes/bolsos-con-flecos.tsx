import { createFileRoute } from "@tanstack/react-router";

import { HubPage, hubHead } from "@/components/site/HubPage";
import { HUBS } from "@/data/guides";

const HUB = HUBS.find((h) => h.path === "/bolsos-con-flecos")!;

export const Route = createFileRoute("/bolsos-con-flecos")({
  head: () => hubHead(HUB),
  component: () => <HubPage hub={HUB} />,
});
