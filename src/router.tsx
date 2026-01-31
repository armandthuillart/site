import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { NotFound } from "@/components/not-found.tsx";
import { routeTree } from "@/routeTree.gen.ts";

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}

export function getRouter() {
	return createTanStackRouter({
		defaultNotFoundComponent: NotFound,
		defaultPreload: "intent",
		routeTree,
		scrollRestoration: true,
	});
}
