import { createFileRoute } from "@tanstack/react-router";

import { buildHealthResponse } from "@/lib/health";

export const Route = createFileRoute("/api/health")({
	ssr: false,
	server: {
		handlers: {
			GET: () => {
				return Response.json(buildHealthResponse(), {
					headers: {
						"Cache-Control": "no-cache, no-store, must-revalidate",
					},
				});
			},
		},
	},
});
