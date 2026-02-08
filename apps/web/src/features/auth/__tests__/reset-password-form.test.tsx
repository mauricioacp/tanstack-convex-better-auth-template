import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRouterMock, mockNavigate } from "@/test/mocks/router";
import { createSonnerMock } from "@/test/mocks/sonner";

const mockResetPassword = vi.fn();

vi.mock("@/lib/auth-client", () => ({
	authClient: {
		resetPassword: (...args: unknown[]) => mockResetPassword(...args),
	},
}));

vi.mock("@tanstack/react-router", () => createRouterMock());

vi.mock("sonner", () => createSonnerMock());

import ResetPasswordForm from "../components/reset-password-form";

describe("ResetPasswordForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render new password and confirm password fields", () => {
		render(<ResetPasswordForm token="test-token" />);
		expect(screen.getByLabelText("New Password")).toBeInTheDocument();
		expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
	});

	it("should render reset password button", () => {
		render(<ResetPasswordForm token="test-token" />);
		expect(
			screen.getByRole("button", { name: /reset password/i }),
		).toBeInTheDocument();
	});

	it("should show validation error when passwords do not match", async () => {
		const user = userEvent.setup();
		render(<ResetPasswordForm token="test-token" />);

		await user.type(screen.getByLabelText("New Password"), "password123");
		await user.type(screen.getByLabelText("Confirm Password"), "different123");
		await user.click(screen.getByRole("button", { name: /reset password/i }));

		await waitFor(() => {
			expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
		});
	});

	it("should show validation error for short password", async () => {
		const user = userEvent.setup();
		render(<ResetPasswordForm token="test-token" />);

		await user.type(screen.getByLabelText("New Password"), "short");
		await user.type(screen.getByLabelText("Confirm Password"), "short");
		await user.click(screen.getByRole("button", { name: /reset password/i }));

		await waitFor(() => {
			expect(
				screen.getByText(/password must be at least 8 characters/i),
			).toBeInTheDocument();
		});
	});

	it("should call authClient.resetPassword with token and new password", async () => {
		mockResetPassword.mockImplementation(
			(_data: unknown, callbacks: { onSuccess: () => void }) => {
				callbacks.onSuccess();
			},
		);

		const user = userEvent.setup();
		render(<ResetPasswordForm token="test-token-123" />);

		await user.type(screen.getByLabelText("New Password"), "newpassword123");
		await user.type(
			screen.getByLabelText("Confirm Password"),
			"newpassword123",
		);
		await user.click(screen.getByRole("button", { name: /reset password/i }));

		await waitFor(() => {
			expect(mockResetPassword).toHaveBeenCalledWith(
				{ newPassword: "newpassword123", token: "test-token-123" },
				expect.objectContaining({
					onSuccess: expect.any(Function),
					onError: expect.any(Function),
				}),
			);
		});
	});

	it("should navigate to /sign-in on success", async () => {
		mockResetPassword.mockImplementation(
			(_data: unknown, callbacks: { onSuccess: () => void }) => {
				callbacks.onSuccess();
			},
		);

		const user = userEvent.setup();
		render(<ResetPasswordForm token="test-token" />);

		await user.type(screen.getByLabelText("New Password"), "newpassword123");
		await user.type(
			screen.getByLabelText("Confirm Password"),
			"newpassword123",
		);
		await user.click(screen.getByRole("button", { name: /reset password/i }));

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith({ to: "/sign-in" });
		});
	});

	it("should show error message on failure with link to forgot-password", async () => {
		mockResetPassword.mockImplementation(
			(
				_data: unknown,
				callbacks: { onError: (e: { error: { message: string } }) => void },
			) => {
				callbacks.onError({ error: { message: "Token expired" } });
			},
		);

		const user = userEvent.setup();
		render(<ResetPasswordForm token="expired-token" />);

		await user.type(screen.getByLabelText("New Password"), "newpassword123");
		await user.type(
			screen.getByLabelText("Confirm Password"),
			"newpassword123",
		);
		await user.click(screen.getByRole("button", { name: /reset password/i }));

		await waitFor(() => {
			expect(screen.getByText(/token expired/i)).toBeInTheDocument();
		});

		const link = screen.getByRole("link", { name: /request a new one/i });
		expect(link).toHaveAttribute("href", "/forgot-password");
	});

	it("should show loading spinner when submitting", async () => {
		mockResetPassword.mockImplementation(() => new Promise(() => {}));

		const user = userEvent.setup();
		render(<ResetPasswordForm token="test-token" />);

		await user.type(screen.getByLabelText("New Password"), "newpassword123");
		await user.type(
			screen.getByLabelText("Confirm Password"),
			"newpassword123",
		);
		await user.click(screen.getByRole("button", { name: /reset password/i }));

		await waitFor(() => {
			const button = screen.getByRole("button", { name: /reset password/i });
			expect(button.querySelector(".animate-spin")).toBeInTheDocument();
		});
	});

	it("should disable inputs when submitting", async () => {
		mockResetPassword.mockImplementation(() => new Promise(() => {}));

		const user = userEvent.setup();
		render(<ResetPasswordForm token="test-token" />);

		await user.type(screen.getByLabelText("New Password"), "newpassword123");
		await user.type(
			screen.getByLabelText("Confirm Password"),
			"newpassword123",
		);
		await user.click(screen.getByRole("button", { name: /reset password/i }));

		await waitFor(() => {
			expect(screen.getByLabelText("New Password")).toBeDisabled();
			expect(screen.getByLabelText("Confirm Password")).toBeDisabled();
		});
	});
});
