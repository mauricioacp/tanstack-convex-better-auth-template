import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { authClient } from "@/lib/auth-client";
import { nameSchema } from "@/lib/validations";
import * as m from "@/paraglide/messages";

type ProfileFormProps = {
	currentName: string;
};

export function ProfileForm({ currentName }: ProfileFormProps) {
	const form = useForm({
		defaultValues: {
			name: currentName,
		},
		onSubmit: async ({ value }) => {
			const result = await authClient.updateUser({ name: value.name });
			if (result.error) {
				toast.error(result.error.message || m.something_went_wrong());
			} else {
				toast.success(m.profile_updated());
			}
		},
		validators: {
			onSubmit: z.object({
				name: nameSchema,
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
				name="name"
				label={m.display_name()}
				placeholder={m.display_name()}
			/>

			<form.Subscribe>
				{(state) => (
					<Button
						type="submit"
						loading={state.isSubmitting}
						disabled={!state.canSubmit}
					>
						{m.save()}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}
