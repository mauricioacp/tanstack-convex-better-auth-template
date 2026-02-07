import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

import VerifyEmailForm from "@/components/verify-email-form";

export const Route = createFileRoute("/(auth)/verify-email")({
	validateSearch: z.object({
		email: z.email(),
	}),
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
