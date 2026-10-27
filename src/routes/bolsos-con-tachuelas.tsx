import { createFileRoute } from "@tanstack/react-router";

import { HubPage, hubHead } from "@/components/site/HubPage";
import { HUBS } from "@/data/guides";

const HUB = HUBS.find((h) => h.path === "/bolsos-con-tachuelas")!;

export const Route = createFileRoute("/bolsos-con-tachuelas")({
  head: () => hubHead(HUB),
  component: () => <HubPage hub={HUB} />,
});
