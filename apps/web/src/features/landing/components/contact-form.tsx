import { api } from "@acme/backend/convex/_generated/api";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { useCountdown } from "@/hooks/use-countdown";
import { parseAuthError } from "@/lib/rate-limit";
import { emailSchema, nameSchema } from "@/lib/validations";
import * as m from "@/paraglide/messages";

export function ContactForm() {
	const submitContact = useMutation(api.contactForm.submit);
	const [submitted, setSubmitted] = useState(false);
	const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);
	const { secondsLeft, start: startCountdown } = useCountdown();

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			message: "",
		},
		onSubmit: async ({ value }) => {
			try {
				await submitContact({
					name: value.name,
					email: value.email,
					message: value.message,
				});
				toast.success(m.landing_contact_success());
				setSubmitted(true);
				form.reset();
			} catch (error) {
				const parsed = parseAuthError({
					error: {
						status: 429,
						message:
							error instanceof Error ? error.message : "An error occurred",
					},
				});
				if (parsed.isRateLimited) {
					setRateLimitMessage(
						m.too_many_attempts({ seconds: String(parsed.retryAfter) }),
					);
					startCountdown(parsed.retryAfter as number);
				} else {
					toast.error(m.something_went_wrong());
				}
			}
		},
		validators: {
			onSubmit: z.object({
				name: nameSchema,
				email: emailSchema,
				message: z.string().min(10, m.landing_contact_message_min()),
			}),
		},
	});

	const isRateLimited = secondsLeft !== null && secondsLeft > 0;

	if (submitted) {
		return (
			<section id="contact" className="px-4 py-24">
				<div className="mx-auto max-w-lg text-center">
					<div className="rounded-xl border border-primary/20 bg-primary/5 p-8">
						<p className="font-medium text-sm">{m.landing_contact_success()}</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id="contact" className="px-4 py-24">
			<div className="mx-auto max-w-lg">
				<div className="mb-14 text-center">
					<h2 className="mb-3 font-bold text-3xl tracking-tight">
						{m.landing_contact_title()}
					</h2>
					<p className="text-muted-foreground text-sm">
						{m.landing_contact_subtitle()}
					</p>
				</div>

				<div className="rounded-xl border border-border bg-card p-6">
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
									? m.too_many_attempts({ seconds: String(secondsLeft) })
									: rateLimitMessage}
							</p>
						)}

						<FormField
							form={form}
							name="name"
							label={m.landing_contact_name()}
							placeholder={m.landing_contact_name()}
						/>

						<FormField
							form={form}
							name="email"
							label={m.landing_contact_email()}
							type="email"
							placeholder={m.landing_contact_email()}
						/>

						{/* Textarea field — FormField only supports Input, so we handle manually */}
						<form.Field name="message">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>
										{m.landing_contact_message()}
									</Label>
									<form.Subscribe selector={(s) => s.isSubmitting}>
										{(isSubmitting) => (
											<textarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder={m.landing_contact_message_placeholder()}
												disabled={isSubmitting}
												rows={4}
												className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
											/>
										)}
									</form.Subscribe>
									{field.state.meta.errors.map((error) => (
										<p key={String(error)} className="text-destructive text-xs">
											{String(error)}
										</p>
									))}
								</div>
							)}
						</form.Field>

						<form.Subscribe>
							{(state) => (
								<Button
									type="submit"
									className="w-full"
									loading={state.isSubmitting}
									disabled={!state.canSubmit || isRateLimited}
								>
									{m.landing_contact_send()}
								</Button>
							)}
						</form.Subscribe>
					</form>
				</div>
			</div>
		</section>
	);
}
