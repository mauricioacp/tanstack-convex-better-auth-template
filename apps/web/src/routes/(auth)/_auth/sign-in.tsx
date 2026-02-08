import { createFileRoute } from "@tanstack/react-router";

import SignInForm from "@/features/auth/components/sign-in-form";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/(auth)/_auth/sign-in")({
	head: () => seo({ title: "Iniciar sesión" }),
	component: SignInForm,
});
