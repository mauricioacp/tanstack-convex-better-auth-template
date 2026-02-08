import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRouterMock } from "@/test/mocks/router";
import { createSonnerMock } from "@/test/mocks/sonner";

const mockChangePassword = vi.fn();

vi.mock("@/lib/auth-client", () => ({
	authClient: {
		changePassword: (...args: unknown[]) => mockChangePassword(...args),
	},
}));

vi.mock("@tanstack/react-router", () => createRouterMock());
vi.mock("sonner", () => createSonnerMock());

import { toast } from "sonner";

import { ChangePasswordForm } from "../components/change-password-form";

describe("ChangePasswordForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render current password, new password, and confirm password fields", () => {
		render(<ChangePasswordForm />);
		expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
	});

	it("should render save button", () => {
		render(<ChangePasswordForm />);
		expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
	});

	it("should show validation error when passwords do not match", async () => {
		render(<ChangePasswordForm />);

		await userEvent.type(
			screen.getByLabelText(/current password/i),
			"oldpassword1",
		);
		await userEvent.type(
			screen.getByLabelText(/new password/i),
			"newpassword1",
		);
		await userEvent.type(
			screen.getByLabelText(/confirm password/i),
			"different1",
		);

		await userEvent.click(screen.getByRole("button", { name: /save/i }));

		await waitFor(() => {
			expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
		});
	});

	it("should show validation error for short password", async () => {
		render(<ChangePasswordForm />);

		await userEvent.type(
			screen.getByLabelText(/current password/i),
			"oldpassword1",
		);
		await userEvent.type(screen.getByLabelText(/new password/i), "short");
		await userEvent.type(screen.getByLabelText(/confirm password/i), "short");

		await userEvent.click(screen.getByRole("button", { name: /save/i }));

		await waitFor(() => {
			expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
		});
	});

	it("should call changePassword on successful submit", async () => {
		mockChangePassword.mockResolvedValue({ data: {} });
		render(<ChangePasswordForm />);

		await userEvent.type(
			screen.getByLabelText(/current password/i),
			"oldpassword1",
		);
		await userEvent.type(
			screen.getByLabelText(/new password/i),
			"newpassword1",
		);
		await userEvent.type(
			screen.getByLabelText(/confirm password/i),
			"newpassword1",
		);

		await userEvent.click(screen.getByRole("button", { name: /save/i }));

		await waitFor(() => {
			expect(mockChangePassword).toHaveBeenCalledWith({
				currentPassword: "oldpassword1",
				newPassword: "newpassword1",
			});
		});
	});

	it("should show success toast after password change", async () => {
		mockChangePassword.mockResolvedValue({ data: {} });
		render(<ChangePasswordForm />);

		await userEvent.type(
			screen.getByLabelText(/current password/i),
			"oldpassword1",
		);
		await userEvent.type(
			screen.getByLabelText(/new password/i),
			"newpassword1",
		);
		await userEvent.type(
			screen.getByLabelText(/confirm password/i),
			"newpassword1",
		);

		await userEvent.click(screen.getByRole("button", { name: /save/i }));

		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(
				"Password changed successfully",
			);
		});
	});

	it("should show error toast on API failure", async () => {
		mockChangePassword.mockResolvedValue({
			error: { message: "Wrong password" },
		});
		render(<ChangePasswordForm />);

		await userEvent.type(
			screen.getByLabelText(/current password/i),
			"oldpassword1",
		);
		await userEvent.type(
			screen.getByLabelText(/new password/i),
			"newpassword1",
		);
		await userEvent.type(
			screen.getByLabelText(/confirm password/i),
			"newpassword1",
		);

		await userEvent.click(screen.getByRole("button", { name: /save/i }));

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith("Wrong password");
		});
	});
});
