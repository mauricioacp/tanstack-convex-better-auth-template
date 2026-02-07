import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validations";

import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { FormField } from "./ui/form-field";

export default function ResetPasswordForm({ token }: { token: string }) {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.resetPassword(
				{
					newPassword: value.password,
					token,
				},
				{
					onSuccess: () => {
						toast.success("Password reset successful");
						navigate({ to: "/sign-in" });
					},
					onError: (err) => {
						setError(err.error.message || "Failed to reset password");
					},
				},
			);
		},
		validators: {
			onSubmit: z
				.object({
					password: passwordSchema,
					confirmPassword: z.string(),
				})
				.refine((data) => data.password === data.confirmPassword, {
					message: "Passwords do not match",
					path: ["confirmPassword"],
				}),
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Reset Password</CardTitle>
				<CardDescription>Enter your new password</CardDescription>
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
						name="password"
						label="New Password"
						type="password"
					/>
					<FormField
						form={form}
						name="confirmPassword"
						label="Confirm Password"
						type="password"
					/>

					{error && (
						<div className="space-y-2">
							<p className="text-destructive text-xs">{error}</p>
							<p className="text-xs">
								Your reset link may have expired.{" "}
								<Link
									to="/forgot-password"
									className="underline underline-offset-4"
								>
									Request a new one
								</Link>
							</p>
						</div>
					)}

					<form.Subscribe>
						{(state) => (
							<Button
								type="submit"
								className="w-full"
								loading={state.isSubmitting}
								disabled={!state.canSubmit}
							>
								Reset Password
							</Button>
						)}
					</form.Subscribe>
				</form>
			</CardContent>
		</Card>
	);
}
