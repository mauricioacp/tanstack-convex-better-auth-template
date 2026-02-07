import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();
const mockSignInEmail = vi.fn();

vi.mock("@/lib/auth-client", () => ({
	authClient: {
		signIn: {
			email: (...args: unknown[]) => mockSignInEmail(...args),
		},
	},
}));

vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => mockNavigate,
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

import SignInForm from "../sign-in-form";

describe("SignInForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render email and password fields", () => {
		render(<SignInForm />);
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
	});

	it("should render sign in button", () => {
		render(<SignInForm />);
		expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
	});

	it("should render link to sign up page", () => {
		render(<SignInForm />);
		const link = screen.getByRole("link", { name: /sign up/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/sign-up");
	});

	it("should render link to forgot password page", () => {
		render(<SignInForm />);
		const link = screen.getByRole("link", { name: /forgot password/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/forgot-password");
	});

	it("should show validation errors for empty fields on submit", async () => {
		const user = userEvent.setup();
		render(<SignInForm />);

		await user.click(screen.getByRole("button", { name: "Sign In" }));

		await waitFor(() => {
			expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
		});
	});

	it("should call authClient.signIn.email with correct values", async () => {
		mockSignInEmail.mockImplementation(
			(_data: unknown, callbacks: { onSuccess: () => void }) => {
				callbacks.onSuccess();
			},
		);

		const user = userEvent.setup();
		render(<SignInForm />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Sign In" }));

		await waitFor(() => {
			expect(mockSignInEmail).toHaveBeenCalledWith(
				{ email: "test@example.com", password: "password123" },
				expect.objectContaining({
					onSuccess: expect.any(Function),
					onError: expect.any(Function),
				}),
			);
		});
	});

	it("should navigate to /dashboard on successful sign in", async () => {
		mockSignInEmail.mockImplementation(
			(_data: unknown, callbacks: { onSuccess: () => void }) => {
				callbacks.onSuccess();
			},
		);

		const user = userEvent.setup();
		render(<SignInForm />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Sign In" }));

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
		});
	});

	it("should show loading spinner when submitting", async () => {
		mockSignInEmail.mockImplementation(() => new Promise(() => {}));

		const user = userEvent.setup();
		render(<SignInForm />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Sign In" }));

		await waitFor(() => {
			const button = screen.getByRole("button", { name: /sign in/i });
			expect(button.querySelector(".animate-spin")).toBeInTheDocument();
		});
	});

	it("should disable inputs when submitting", async () => {
		mockSignInEmail.mockImplementation(() => new Promise(() => {}));

		const user = userEvent.setup();
		render(<SignInForm />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Sign In" }));

		await waitFor(() => {
			expect(screen.getByLabelText("Email")).toBeDisabled();
			expect(screen.getByLabelText("Password")).toBeDisabled();
		});
	});

	it("should show rate limit message on 429 error", async () => {
		mockSignInEmail.mockImplementation(
			(
				_data: unknown,
				callbacks: {
					onError: (e: { error: { status: number; message: string } }) => void;
				},
			) => {
				callbacks.onError({
					error: { status: 429, message: "Too many requests" },
				});
			},
		);

		const user = userEvent.setup();
		render(<SignInForm />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Sign In" }));

		await waitFor(() => {
			expect(screen.getByText(/too many attempts/i)).toBeInTheDocument();
		});
	});
});
