import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockRequestPasswordReset = vi.fn();

vi.mock("@/lib/auth-client", () => ({
	authClient: {
		requestPasswordReset: (...args: unknown[]) =>
			mockRequestPasswordReset(...args),
	},
}));

vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => vi.fn(),
	Link: ({
		to,
		children,
		...props
	}: {
		to: string;
		children: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

import ForgotPasswordForm from "../forgot-password-form";

describe("ForgotPasswordForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render email field", () => {
		render(<ForgotPasswordForm />);
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
	});

	it("should render submit button", () => {
		render(<ForgotPasswordForm />);
		expect(
			screen.getByRole("button", { name: /send reset link/i }),
		).toBeInTheDocument();
	});

	it("should render link back to sign in", () => {
		render(<ForgotPasswordForm />);
		const link = screen.getByRole("link", { name: /sign in/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/sign-in");
	});

	it("should show validation error for invalid email", async () => {
		const user = userEvent.setup();
		render(<ForgotPasswordForm />);

		await user.click(screen.getByRole("button", { name: /send reset link/i }));

		await waitFor(() => {
			expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
		});
	});

	it("should show success message after submit", async () => {
		mockRequestPasswordReset.mockResolvedValue({});

		const user = userEvent.setup();
		render(<ForgotPasswordForm />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.click(screen.getByRole("button", { name: /send reset link/i }));

		await waitFor(() => {
			expect(screen.getByText(/check your email/i)).toBeInTheDocument();
		});
	});

	it("should show success message even on error (prevent email enumeration)", async () => {
		mockRequestPasswordReset.mockRejectedValue(new Error("User not found"));

		const user = userEvent.setup();
		render(<ForgotPasswordForm />);

		await user.type(screen.getByLabelText("Email"), "nonexistent@example.com");
		await user.click(screen.getByRole("button", { name: /send reset link/i }));

		await waitFor(() => {
			expect(screen.getByText(/check your email/i)).toBeInTheDocument();
		});
	});

	it("should call authClient.requestPasswordReset with email and redirectTo", async () => {
		mockRequestPasswordReset.mockResolvedValue({});

		const user = userEvent.setup();
		render(<ForgotPasswordForm />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.click(screen.getByRole("button", { name: /send reset link/i }));

		await waitFor(() => {
			expect(mockRequestPasswordReset).toHaveBeenCalledWith({
				email: "test@example.com",
				redirectTo: "/reset-password",
			});
		});
	});

	it("should show loading spinner when submitting", async () => {
		mockRequestPasswordReset.mockImplementation(() => new Promise(() => {}));

		const user = userEvent.setup();
		render(<ForgotPasswordForm />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.click(screen.getByRole("button", { name: /send reset link/i }));

		await waitFor(() => {
			const button = screen.getByRole("button", { name: /send reset link/i });
			expect(button.querySelector(".animate-spin")).toBeInTheDocument();
		});
	});

	it("should disable input when submitting", async () => {
		mockRequestPasswordReset.mockImplementation(() => new Promise(() => {}));

		const user = userEvent.setup();
		render(<ForgotPasswordForm />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.click(screen.getByRole("button", { name: /send reset link/i }));

		await waitFor(() => {
			expect(screen.getByLabelText("Email")).toBeDisabled();
		});
	});
});
