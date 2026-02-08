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
						toast.success("Sign in successful");
					},
					onError: (error) => {
						const parsed = parseAuthError(error);
						if (parsed.isRateLimited) {
							setRateLimitMessage(
								`Too many attempts. Try again in ${parsed.retryAfter}s.`,
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
				<CardTitle>Welcome Back</CardTitle>
				<CardDescription>Sign in to your account</CardDescription>
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
								? `Too many attempts. Try again in ${secondsLeft}s.`
								: rateLimitMessage}
						</p>
					)}

					<FormField form={form} name="email" label="Email" type="email" />

					<FormField
						form={form}
						name="password"
						label="Password"
						type="password"
					>
						<Link
							to="/forgot-password"
							className="text-muted-foreground text-xs hover:underline"
						>
							Forgot password?
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
								Sign In
							</Button>
						)}
					</form.Subscribe>
				</form>

				<div className="mt-4 text-center text-xs">
					Don&apos;t have an account?{" "}
					<Link to="/sign-up" className="underline underline-offset-4">
						Sign Up
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
