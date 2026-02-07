import { createFileRoute } from "@tanstack/react-router";

import SignUpForm from "@/components/sign-up-form";

export const Route = createFileRoute("/(auth)/_auth/sign-up")({
	component: SignUpForm,
});
