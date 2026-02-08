import { createFileRoute } from "@tanstack/react-router";

import SignInForm from "@/features/auth/components/sign-in-form";
import { seo } from "@/lib/seo";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/(auth)/_auth/sign-in")({
	head: () => seo({ title: m.seo_sign_in(), path: "/sign-in" }),
	component: SignInForm,
});
