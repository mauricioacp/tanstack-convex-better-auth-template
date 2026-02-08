import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

import ResetPasswordForm from "@/features/auth/components/reset-password-form";
import { seo } from "@/lib/seo";

const searchSchema = z.object({
	token: z.string(),
});

export const Route = createFileRoute("/(auth)/_auth/reset-password")({
	validateSearch: searchSchema,
	head: () => seo({ title: "Restablecer contraseña" }),
	component: ResetPasswordPage,
});

function ResetPasswordPage() {
	const { token } = Route.useSearch();
	return <ResetPasswordForm token={token} />;
}
