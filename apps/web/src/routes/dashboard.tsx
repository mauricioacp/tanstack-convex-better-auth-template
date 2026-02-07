import { api } from "@acme/backend/convex/_generated/api";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: ({ context }) => {
		if (!context.isAuthenticated) {
			throw redirect({ to: "/sign-in" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const privateData = useQuery(api.privateData.get);

	return (
		<div className="p-4">
			<h1 className="font-bold text-2xl">Dashboard</h1>
			<p>privateData: {privateData?.message}</p>
		</div>
	);
}
