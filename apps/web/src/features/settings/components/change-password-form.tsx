import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validations";
import * as m from "@/paraglide/messages";

export function ChangePasswordForm() {
	const form = useForm({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
		onSubmit: async ({ value }) => {
			if (value.newPassword !== value.confirmPassword) {
				return;
			}
			const result = await authClient.changePassword({
				currentPassword: value.currentPassword,
				newPassword: value.newPassword,
			});
			if (result.error) {
				toast.error(result.error.message || m.something_went_wrong());
			} else {
				toast.success(m.password_changed());
				form.reset();
			}
		},
		validators: {
			onSubmit: z.object({
				currentPassword: passwordSchema,
				newPassword: passwordSchema,
				confirmPassword: z.string(),
			}),
		},
	});

	return (
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
				name="currentPassword"
				label={m.current_password()}
				type="password"
			/>

			<FormField
				form={form}
				name="newPassword"
				label={m.new_password()}
				type="password"
			/>

			<FormField
				form={form}
				name="confirmPassword"
				label={m.confirm_password()}
				type="password"
			/>

			<form.Subscribe
				selector={(state) => ({
					isSubmitting: state.isSubmitting,
					canSubmit: state.canSubmit,
					values: state.values,
				})}
			>
				{({ isSubmitting, canSubmit, values }) => (
					<>
						{values.confirmPassword &&
							values.newPassword !== values.confirmPassword && (
								<p className="text-destructive text-xs">
									{m.passwords_do_not_match()}
								</p>
							)}
						<Button type="submit" loading={isSubmitting} disabled={!canSubmit}>
							{m.save()}
						</Button>
					</>
				)}
			</form.Subscribe>
		</form>
	);
}
