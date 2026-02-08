import { createFileRoute } from "@tanstack/react-router";

import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/(auth)/_auth/forgot-password")({
	head: () => seo({ title: "Recuperar contraseña" }),
	component: ForgotPasswordForm,
});
