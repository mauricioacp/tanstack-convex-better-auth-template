import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { emailSchema, nameSchema, passwordSchema } from "@/lib/validations";

import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { FormField } from "./ui/form-field";

export default function SignUpForm() {
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: value.name,
				},
				{
					onSuccess: () => {
						navigate({
							to: "/verify-email",
							search: { email: value.email },
						});
						toast.success(
							"Account created! Check your email for a verification code.",
						);
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				name: nameSchema,
				email: emailSchema,
				password: passwordSchema,
			}),
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Create Account</CardTitle>
				<CardDescription>Sign up for a new account</CardDescription>
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
					<FormField form={form} name="name" label="Name" />
					<FormField form={form} name="email" label="Email" type="email" />
					<FormField
						form={form}
						name="password"
						label="Password"
						type="password"
					/>

					<form.Subscribe>
						{(state) => (
							<Button
								type="submit"
								className="w-full"
								loading={state.isSubmitting}
								disabled={!state.canSubmit}
							>
								Sign Up
							</Button>
						)}
					</form.Subscribe>
				</form>

				<div className="mt-4 text-center text-xs">
					Already have an account?{" "}
					<Link to="/sign-in" className="underline underline-offset-4">
						Sign In
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
