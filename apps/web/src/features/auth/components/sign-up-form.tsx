import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
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
import { emailSchema, nameSchema, passwordSchema } from "@/lib/validations";
import * as m from "@/paraglide/messages";

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
						toast.success(m.account_created());
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
				<CardTitle>{m.create_account()}</CardTitle>
				<CardDescription>{m.sign_up_description()}</CardDescription>
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
					<FormField form={form} name="name" label={m.name_label()} />
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
					/>

					<form.Subscribe>
						{(state) => (
							<Button
								type="submit"
								className="w-full"
								loading={state.isSubmitting}
								disabled={!state.canSubmit}
							>
								{m.sign_up()}
							</Button>
						)}
					</form.Subscribe>
				</form>

				<div className="mt-4 text-center text-xs">
					{m.have_account()}{" "}
					<Link to="/sign-in" className="underline underline-offset-4">
						{m.sign_in()}
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
