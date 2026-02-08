import { createFileRoute } from "@tanstack/react-router";

import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";
import { seo } from "@/lib/seo";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/(auth)/_auth/forgot-password")({
	head: () => seo({ title: m.seo_forgot_password(), path: "/forgot-password" }),
	component: ForgotPasswordForm,
});
