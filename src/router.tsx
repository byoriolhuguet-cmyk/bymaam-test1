import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Precarga al pasar el ratón/tocar: la navegación se siente instantánea
    defaultPreload: "intent",
    // Transiciones nativas entre páginas (View Transitions API). Sin soporte → animación CSS de entrada.
    defaultViewTransition: true,
  });

  return router;
};
