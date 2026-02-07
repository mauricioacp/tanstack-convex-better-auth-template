import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { emailSchema } from "@/lib/validations";

import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { FormField } from "./ui/form-field";

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
					<CardTitle>Check your email</CardTitle>
					<CardDescription>
						If an account exists with that email, we sent a password reset link.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Link to="/sign-in" className="text-xs underline underline-offset-4">
						Back to Sign In
					</Link>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Forgot Password</CardTitle>
				<CardDescription>
					Enter your email to receive a reset link
				</CardDescription>
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
					<FormField form={form} name="email" label="Email" type="email" />

					<form.Subscribe>
						{(state) => (
							<Button
								type="submit"
								className="w-full"
								loading={state.isSubmitting}
								disabled={!state.canSubmit}
							>
								Send Reset Link
							</Button>
						)}
					</form.Subscribe>
				</form>

				<div className="mt-4 text-center text-xs">
					<Link to="/sign-in" className="underline underline-offset-4">
						Back to Sign In
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
