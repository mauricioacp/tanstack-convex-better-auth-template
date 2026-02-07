import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { useCountdown } from "@/hooks/use-countdown";
import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { FormField } from "./ui/form-field";

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
						toast.success("Email verified successfully");
					},
					onError: (error) => {
						toast.error(error.error.message);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				otp: z.string().length(6, "Code must be 6 digits"),
			}),
		},
	});

	const isResendCoolingDown =
		resendSecondsLeft !== null && resendSecondsLeft > 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Verify Your Email</CardTitle>
				<CardDescription>
					We sent a verification code to <strong>{email}</strong>
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
						label="Verification Code"
						placeholder="Enter 6-digit code"
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
								Verify Email
							</Button>
						)}
					</form.Subscribe>
				</form>

				<div className="mt-4 text-center text-xs">
					Didn't receive a code?{" "}
					<Button
						variant="link"
						className="h-auto p-0 text-xs underline underline-offset-4"
						disabled={isResendCoolingDown}
						onClick={() => {
							authClient.emailOtp.sendVerificationOtp({
								email,
								type: "email-verification",
							});
							toast.success("Verification code resent");
							startResendCooldown(RESEND_COOLDOWN);
						}}
					>
						{isResendCoolingDown
							? `Resend Code (${resendSecondsLeft}s)`
							: "Resend Code"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
