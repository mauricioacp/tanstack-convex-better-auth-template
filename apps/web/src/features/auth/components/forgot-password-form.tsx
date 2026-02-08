import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { authClient } from "@/lib/auth-client";
import { emailSchema } from "@/lib/validations";
import * as m from "@/paraglide/messages";

export default function ForgotPasswordForm() {
	const [submitted, setSubmitted] = useState(false);

	const form = useForm({
		defaultValues: {
			email: "",
		},
		onSubmit: async ({ value }) => {
			try {
				await authClient.requestPasswordReset({
					email: value.email,
					redirectTo: "/reset-password",
				});
			} catch {
				// Show success regardless to prevent email enumeration
			}
			setSubmitted(true);
		},
		validators: {
			onSubmit: z.object({
				email: emailSchema,
			}),
		},
	});

	if (submitted) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{m.check_your_email()}</CardTitle>
					<CardDescription>{m.reset_email_sent()}</CardDescription>
				</CardHeader>
				<CardContent>
					<Link to="/sign-in" className="text-xs underline underline-offset-4">
						{m.back_to_sign_in()}
					</Link>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{m.forgot_password_title()}</CardTitle>
				<CardDescription>{m.forgot_password_description()}</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<FormField
						form={form}
						name="email"
						label={m.email_label()}
						type="email"
					/>

					<form.Subscribe>
						{(state) => (
							<Button
								type="submit"
								className="w-full"
								loading={state.isSubmitting}
								disabled={!state.canSubmit}
							>
								{m.send_reset_link()}
							</Button>
						)}
					</form.Subscribe>
				</form>

				<div className="mt-4 text-center text-xs">
					<Link to="/sign-in" className="underline underline-offset-4">
						{m.back_to_sign_in()}
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
