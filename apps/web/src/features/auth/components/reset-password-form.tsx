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
import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validations";
import * as m from "@/paraglide/messages";

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
						toast.success(m.password_reset_success());
						navigate({ to: "/sign-in" });
					},
					onError: (err) => {
						setError(err.error.message || m.failed_to_reset_password());
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
					message: m.passwords_do_not_match(),
					path: ["confirmPassword"],
				}),
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>{m.reset_password()}</CardTitle>
				<CardDescription>{m.reset_password_description()}</CardDescription>
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
						label={m.new_password()}
						type="password"
					/>
					<FormField
						form={form}
						name="confirmPassword"
						label={m.confirm_password()}
						type="password"
					/>

					{error && (
						<div className="space-y-2">
							<p className="text-destructive text-xs">{error}</p>
							<p className="text-xs">
								{m.reset_link_expired()}{" "}
								<Link
									to="/forgot-password"
									className="underline underline-offset-4"
								>
									{m.request_new_link()}
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
								{m.reset_password()}
							</Button>
						)}
					</form.Subscribe>
				</form>
			</CardContent>
		</Card>
	);
}
