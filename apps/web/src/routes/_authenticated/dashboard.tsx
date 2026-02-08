import { api } from "@acme/backend/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/seo";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/_authenticated/dashboard")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(convexQuery(api.privateData.get, {}));
	},
	head: () => seo({ title: m.seo_dashboard(), path: "/dashboard" }),
	component: RouteComponent,
});

function RouteComponent() {
	const { data: privateData } = useSuspenseQuery(
		convexQuery(api.privateData.get, {}),
	);

	return (
		<div className="p-4">
			<h1 className="font-bold text-2xl">{m.dashboard()}</h1>
			<p>privateData: {privateData?.message}</p>
		</div>
	);
}
