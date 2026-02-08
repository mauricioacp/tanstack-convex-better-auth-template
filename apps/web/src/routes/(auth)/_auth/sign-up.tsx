import { createFileRoute } from "@tanstack/react-router";

import SignUpForm from "@/features/auth/components/sign-up-form";
import { seo } from "@/lib/seo";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/(auth)/_auth/sign-up")({
	head: () => seo({ title: m.seo_sign_up(), path: "/sign-up" }),
	component: SignUpForm,
});
