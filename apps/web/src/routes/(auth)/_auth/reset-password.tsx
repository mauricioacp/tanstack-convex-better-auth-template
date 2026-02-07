import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

import ResetPasswordForm from "@/components/reset-password-form";

const searchSchema = z.object({
	token: z.string(),
});

export const Route = createFileRoute("/(auth)/_auth/reset-password")({
	validateSearch: searchSchema,
	component: ResetPasswordPage,
});

function ResetPasswordPage() {
	const { token } = Route.useSearch();
	return <ResetPasswordForm token={token} />;
}
