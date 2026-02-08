import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

import VerifyEmailForm from "@/features/auth/components/verify-email-form";
import { seo } from "@/lib/seo";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/(auth)/verify-email")({
	validateSearch: z.object({
		email: z.email(),
	}),
	head: () => seo({ title: m.seo_verify_email(), path: "/verify-email" }),
	component: VerifyEmailPage,
});

function VerifyEmailPage() {
	const { email } = Route.useSearch();

	return (
		<div className="flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<VerifyEmailForm email={email} />
			</div>
		</div>
	);
}
