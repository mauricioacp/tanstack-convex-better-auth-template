import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

import ResetPasswordForm from "@/features/auth/components/reset-password-form";
import { seo } from "@/lib/seo";
import * as m from "@/paraglide/messages";

const searchSchema = z.object({
	token: z.string(),
});

export const Route = createFileRoute("/(auth)/_auth/reset-password")({
	validateSearch: searchSchema,
	head: () => seo({ title: m.seo_reset_password(), path: "/reset-password" }),
	component: ResetPasswordPage,
});

function ResetPasswordPage() {
	const { token } = Route.useSearch();
	return <ResetPasswordForm token={token} />;
}
