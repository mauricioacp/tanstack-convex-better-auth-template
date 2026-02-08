import { createFileRoute } from "@tanstack/react-router";

import SignUpForm from "@/features/auth/components/sign-up-form";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/(auth)/_auth/sign-up")({
	head: () => seo({ title: "Crear cuenta" }),
	component: SignUpForm,
});
