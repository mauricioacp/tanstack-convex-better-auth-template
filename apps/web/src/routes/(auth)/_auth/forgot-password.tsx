import { createFileRoute } from "@tanstack/react-router";

import ForgotPasswordForm from "@/components/forgot-password-form";

export const Route = createFileRoute("/(auth)/_auth/forgot-password")({
	component: ForgotPasswordForm,
});
