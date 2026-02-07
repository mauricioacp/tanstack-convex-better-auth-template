import type * as React from "react";
import type { ReactNode } from "react";
import { Input } from "./input";
import { Label } from "./label";

type AnyForm = {
	// biome-ignore lint/suspicious/noExplicitAny: TanStack Form's ReactFormExtendedApi has 12 invariant type params
	Field: React.ComponentType<any>;
	// biome-ignore lint/suspicious/noExplicitAny: same as above
	Subscribe: React.ComponentType<any>;
};

interface FormFieldProps {
	form: AnyForm;
	name: string;
	label: string;
	type?: string;
	placeholder?: string;
	inputMode?: "numeric" | "text" | "email" | "tel" | "search" | "url";
	children?: ReactNode;
}

function FormField({
	form,
	name,
	label,
	type,
	placeholder,
	inputMode,
	children,
}: FormFieldProps) {
	return (
		<div>
			<form.Field name={name}>
				{(field: {
					name: string;
					state: {
						value: string;
						meta: { errors: Array<{ message: string }> };
					};
					handleBlur: () => void;
					handleChange: (value: string) => void;
				}) => (
					<div className="space-y-2">
						{children ? (
							<div className="flex items-center justify-between">
								<Label htmlFor={field.name}>{label}</Label>
								{children}
							</div>
						) : (
							<Label htmlFor={field.name}>{label}</Label>
						)}
						<form.Subscribe
							selector={(s: { isSubmitting: boolean }) => s.isSubmitting}
						>
							{(isSubmitting: boolean) => (
								<Input
									id={field.name}
									name={field.name}
									type={type}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder={placeholder}
									inputMode={inputMode}
									disabled={isSubmitting}
								/>
							)}
						</form.Subscribe>
						{field.state.meta.errors.map((error) => (
							<p key={error?.message} className="text-destructive text-xs">
								{error?.message}
							</p>
						))}
					</div>
				)}
			</form.Field>
		</div>
	);
}

export { FormField };
