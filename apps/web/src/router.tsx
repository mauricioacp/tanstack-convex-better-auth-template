import { env } from "@acme/env/web";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { deLocalizeUrl, localizeUrl } from "./paraglide/runtime.js";

import { ErrorBoundary } from "./components/error-boundary";
import Loader from "./components/loader";
import NotFound from "./components/not-found";
import "./index.css";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const convexUrl = env.VITE_CONVEX_URL;
	if (!convexUrl) {
		throw new Error("VITE_CONVEX_URL is not set");
	}

	const convexQueryClient = new ConvexQueryClient(convexUrl);

	const queryClient: QueryClient = new QueryClient({
		defaultOptions: {
			queries: {
				queryKeyHashFn: convexQueryClient.hashFn(),
				queryFn: convexQueryClient.queryFn(),
			},
		},
	});
	convexQueryClient.connect(queryClient);

	const router = createTanStackRouter({
		routeTree,
		defaultPreload: "intent",
		rewrite: {
			input: ({ url }) => deLocalizeUrl(url),
			output: ({ url }) => localizeUrl(url),
		},
		defaultPendingComponent: () => <Loader />,
		defaultNotFoundComponent: () => <NotFound />,
		defaultErrorComponent: ({ error, reset }) => (
			<ErrorBoundary error={error} reset={reset} />
		),
		context: { queryClient, convexQueryClient },
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
