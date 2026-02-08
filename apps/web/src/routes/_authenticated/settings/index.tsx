import { api } from "@acme/backend/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { SettingsPage } from "@/features/settings/components/settings-page";
import { seo } from "@/lib/seo";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/_authenticated/settings/")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(
			convexQuery(api.auth.getCurrentUser, {}),
		);
	},
	head: () => seo({ title: m.seo_settings(), path: "/settings" }),
	component: SettingsComponent,
});

function SettingsComponent() {
	const { data: user } = useSuspenseQuery(
		convexQuery(api.auth.getCurrentUser, {}),
	);

	return <SettingsPage currentName={user?.name ?? ""} />;
}
