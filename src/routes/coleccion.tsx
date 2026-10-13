import { Outlet, createFileRoute } from "@tanstack/react-router";

/** Capa común de /coleccion: listado (index) y fichas de producto ($slug). */
export const Route = createFileRoute("/coleccion")({
  component: () => <Outlet />,
});
