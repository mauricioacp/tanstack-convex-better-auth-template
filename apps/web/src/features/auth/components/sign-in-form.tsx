import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
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
import { useCountdown } from "@/hooks/use-countdown";
import { authClient } from "@/lib/auth-client";
import { parseAuthError } from "@/lib/rate-limit";
import { emailSchema, passwordSchema } from "@/lib/validations";
import * as m from "@/paraglide/messages";

export default function SignInForm() {
	const navigate = useNavigate();
	const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);
	const { secondsLeft, start: startCountdown } = useCountdown();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: () => {
						navigate({
							to: "/dashboard",
						});
						toast.success(m.sign_in_success());
					},
					onError: (error) => {
						const parsed = parseAuthError(error);
						if (parsed.isRateLimited) {
							setRateLimitMessage(
								m.too_many_attempts({
									seconds: String(parsed.retryAfter),
								}),
							);
							startCountdown(parsed?.retryAfter as number);
						} else {
							toast.error(error.error.message || error.error.statusText);
						}
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: emailSchema,
				password: passwordSchema,
			}),
		},
	});

	const isRateLimited = secondsLeft !== null && secondsLeft > 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{m.welcome_back()}</CardTitle>
				<CardDescription>{m.sign_in_description()}</CardDescription>
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
					{rateLimitMessage && (
						<p className="text-destructive text-xs">
							{isRateLimited
								? m.too_many_attempts({
										seconds: String(secondsLeft),
									})
								: rateLimitMessage}
						</p>
					)}

					<FormField
						form={form}
						name="email"
						label={m.email_label()}
						type="email"
					/>

					<FormField
						form={form}
						name="password"
						label={m.password_label()}
						type="password"
					>
						<Link
							to="/forgot-password"
							className="text-muted-foreground text-xs hover:underline"
						>
							{m.forgot_password_link()}
						</Link>
					</FormField>

					<form.Subscribe>
						{(state) => (
							<Button
								type="submit"
								className="w-full"
								loading={state.isSubmitting}
								disabled={!state.canSubmit || isRateLimited}
							>
								{m.sign_in()}
							</Button>
						)}
					</form.Subscribe>
				</form>

				<div className="mt-4 text-center text-xs">
					{m.no_account()}{" "}
					<Link to="/sign-up" className="underline underline-offset-4">
						{m.sign_up()}
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
