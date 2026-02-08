import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRouterMock, mockNavigate } from "@/test/mocks/router";
import { createSonnerMock } from "@/test/mocks/sonner";

const mockVerifyEmail = vi.fn();
const mockSendVerificationOtp = vi.fn();

vi.mock("@/lib/auth-client", () => ({
	authClient: {
		emailOtp: {
			verifyEmail: (...args: unknown[]) => mockVerifyEmail(...args),
			sendVerificationOtp: (...args: unknown[]) =>
				mockSendVerificationOtp(...args),
		},
	},
}));

vi.mock("@tanstack/react-router", () => createRouterMock());

vi.mock("sonner", () => createSonnerMock());

import VerifyEmailForm from "../components/verify-email-form";

describe("VerifyEmailForm", () => {
	const testEmail = "test@example.com";

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render OTP input field and verify button", () => {
		render(<VerifyEmailForm email={testEmail} />);
		expect(screen.getByLabelText("Verification Code")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Verify Email" }),
		).toBeInTheDocument();
	});

	it("should display the email address the code was sent to", () => {
		render(<VerifyEmailForm email={testEmail} />);
		expect(screen.getByText(testEmail)).toBeInTheDocument();
	});

	it("should show validation error for empty OTP on submit", async () => {
		const user = userEvent.setup();
		render(<VerifyEmailForm email={testEmail} />);

		await user.click(screen.getByRole("button", { name: "Verify Email" }));

		await waitFor(() => {
			expect(screen.getByText(/code must be 6 digits/i)).toBeInTheDocument();
		});
	});

	it("should show validation error for short OTP on submit", async () => {
		const user = userEvent.setup();
		render(<VerifyEmailForm email={testEmail} />);

		await user.type(screen.getByLabelText("Verification Code"), "123");
		await user.click(screen.getByRole("button", { name: "Verify Email" }));

		await waitFor(() => {
			expect(screen.getByText(/code must be 6 digits/i)).toBeInTheDocument();
		});
	});

	it("should call authClient.emailOtp.verifyEmail with email and otp on submit", async () => {
		mockVerifyEmail.mockImplementation(
			(_data: unknown, callbacks: { onSuccess: () => void }) => {
				callbacks.onSuccess();
			},
		);

		const user = userEvent.setup();
		render(<VerifyEmailForm email={testEmail} />);

		await user.type(screen.getByLabelText("Verification Code"), "123456");
		await user.click(screen.getByRole("button", { name: "Verify Email" }));

		await waitFor(() => {
			expect(mockVerifyEmail).toHaveBeenCalledWith(
				{ email: testEmail, otp: "123456" },
				expect.objectContaining({
					onSuccess: expect.any(Function),
					onError: expect.any(Function),
				}),
			);
		});
	});

	it("should navigate to /dashboard on success", async () => {
		mockVerifyEmail.mockImplementation(
			(_data: unknown, callbacks: { onSuccess: () => void }) => {
				callbacks.onSuccess();
			},
		);

		const user = userEvent.setup();
		render(<VerifyEmailForm email={testEmail} />);

		await user.type(screen.getByLabelText("Verification Code"), "123456");
		await user.click(screen.getByRole("button", { name: "Verify Email" }));

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
		});
	});

	it("should show error toast on failure", async () => {
		const { toast } = await import("sonner");
		mockVerifyEmail.mockImplementation(
			(
				_data: unknown,
				callbacks: { onError: (error: { error: { message: string } }) => void },
			) => {
				callbacks.onError({ error: { message: "Invalid code" } });
			},
		);

		const user = userEvent.setup();
		render(<VerifyEmailForm email={testEmail} />);

		await user.type(screen.getByLabelText("Verification Code"), "000000");
		await user.click(screen.getByRole("button", { name: "Verify Email" }));

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith("Invalid code");
		});
	});

	it("should render resend code button", () => {
		render(<VerifyEmailForm email={testEmail} />);
		expect(
			screen.getByRole("button", { name: /resend code/i }),
		).toBeInTheDocument();
	});

	it("should call authClient.emailOtp.sendVerificationOtp on resend click", async () => {
		const user = userEvent.setup();
		render(<VerifyEmailForm email={testEmail} />);

		await user.click(screen.getByRole("button", { name: /resend code/i }));

		await waitFor(() => {
			expect(mockSendVerificationOtp).toHaveBeenCalledWith({
				email: testEmail,
				type: "email-verification",
			});
		});
	});

	it("should show loading spinner when submitting", async () => {
		mockVerifyEmail.mockImplementation(() => new Promise(() => {}));

		const user = userEvent.setup();
		render(<VerifyEmailForm email={testEmail} />);

		await user.type(screen.getByLabelText("Verification Code"), "123456");
		await user.click(screen.getByRole("button", { name: "Verify Email" }));

		await waitFor(() => {
			const button = screen.getByRole("button", { name: /verify email/i });
			expect(button.querySelector(".animate-spin")).toBeInTheDocument();
		});
	});

	it("should disable input when submitting", async () => {
		mockVerifyEmail.mockImplementation(() => new Promise(() => {}));

		const user = userEvent.setup();
		render(<VerifyEmailForm email={testEmail} />);

		await user.type(screen.getByLabelText("Verification Code"), "123456");
		await user.click(screen.getByRole("button", { name: "Verify Email" }));

		await waitFor(() => {
			expect(screen.getByLabelText("Verification Code")).toBeDisabled();
		});
	});

	it("should show countdown on resend button after click", async () => {
		mockSendVerificationOtp.mockResolvedValue({});

		const user = userEvent.setup();
		render(<VerifyEmailForm email={testEmail} />);

		await user.click(screen.getByRole("button", { name: /resend code/i }));

		await waitFor(() => {
			expect(
				screen.getByRole("button", { name: /resend code \(\d+s\)/i }),
			).toBeInTheDocument();
		});

		expect(screen.getByRole("button", { name: /resend code/i })).toBeDisabled();
	});
});
