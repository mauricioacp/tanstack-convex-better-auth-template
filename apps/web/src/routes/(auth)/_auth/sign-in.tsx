import { createFileRoute } from "@tanstack/react-router";

import SignInForm from "@/components/sign-in-form";

export const Route = createFileRoute("/(auth)/_auth/sign-in")({
	component: SignInForm,
});
