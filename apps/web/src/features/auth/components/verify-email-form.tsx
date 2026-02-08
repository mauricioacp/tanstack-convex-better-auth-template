import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
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
import * as m from "@/paraglide/messages";

const RESEND_COOLDOWN = 60;

export default function VerifyEmailForm({ email }: { email: string }) {
	const navigate = useNavigate();
	const { secondsLeft: resendSecondsLeft, start: startResendCooldown } =
		useCountdown();

	const form = useForm({
		defaultValues: {
			otp: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.emailOtp.verifyEmail(
				{
					email,
					otp: value.otp,
				},
				{
					onSuccess: () => {
						navigate({ to: "/dashboard" });
						toast.success(m.email_verified());
					},
					onError: (error) => {
						toast.error(error.error.message);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				otp: z.string().length(6, m.code_must_be_6_digits()),
			}),
		},
	});

	const isResendCoolingDown =
		resendSecondsLeft !== null && resendSecondsLeft > 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{m.verify_email()}</CardTitle>
				<CardDescription>
					{m.verification_sent()} <strong>{email}</strong>
				</CardDescription>
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
						name="otp"
						label={m.verification_code()}
						placeholder={m.enter_code()}
						inputMode="numeric"
					/>

					<form.Subscribe>
						{(state) => (
							<Button
								type="submit"
								className="w-full"
								loading={state.isSubmitting}
								disabled={!state.canSubmit}
							>
								{m.verify_button()}
							</Button>
						)}
					</form.Subscribe>
				</form>

				<div className="mt-4 text-center text-xs">
					{m.didnt_receive_code()}{" "}
					<Button
						variant="link"
						className="h-auto p-0 text-xs underline underline-offset-4"
						disabled={isResendCoolingDown}
						onClick={() => {
							authClient.emailOtp.sendVerificationOtp({
								email,
								type: "email-verification",
							});
							toast.success(m.verification_resent());
							startResendCooldown(RESEND_COOLDOWN);
						}}
					>
						{isResendCoolingDown
							? m.resend_code_countdown({
									seconds: String(resendSecondsLeft),
								})
							: m.resend_code()}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
