import { api } from "@acme/backend/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/dashboard")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(convexQuery(api.privateData.get, {}));
	},
	head: () => seo({ title: "Dashboard" }),
	component: RouteComponent,
});

function RouteComponent() {
	const { data: privateData } = useSuspenseQuery(
		convexQuery(api.privateData.get, {}),
	);

	return (
		<div className="p-4">
			<h1 className="font-bold text-2xl">Dashboard</h1>
			<p>privateData: {privateData?.message}</p>
		</div>
	);
}
