import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRouterMock, mockNavigate } from "@/test/mocks/router";
import { createSonnerMock } from "@/test/mocks/sonner";

const mockSignUpEmail = vi.fn();

vi.mock("@/lib/auth-client", () => ({
	authClient: {
		signUp: {
			email: (...args: unknown[]) => mockSignUpEmail(...args),
		},
	},
}));

vi.mock("@tanstack/react-router", () => createRouterMock());

vi.mock("sonner", () => createSonnerMock());

import SignUpForm from "../components/sign-up-form";

describe("SignUpForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render name, email, and password fields", () => {
		render(<SignUpForm />);
		expect(screen.getByLabelText("Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
	});

	it("should render sign up button", () => {
		render(<SignUpForm />);
		expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
	});

	it("should render link to sign in page", () => {
		render(<SignUpForm />);
		const link = screen.getByRole("link", { name: /sign in/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/sign-in");
	});

	it("should show validation errors for empty fields on submit", async () => {
		const user = userEvent.setup();
		render(<SignUpForm />);

		await user.click(screen.getByRole("button", { name: "Sign Up" }));

		await waitFor(() => {
			expect(
				screen.getByText(/name must be at least 2 characters/i),
			).toBeInTheDocument();
		});
	});

	it("should call authClient.signUp.email with correct values", async () => {
		mockSignUpEmail.mockImplementation(
			(_data: unknown, callbacks: { onSuccess: () => void }) => {
				callbacks.onSuccess();
			},
		);

		const user = userEvent.setup();
		render(<SignUpForm />);

		await user.type(screen.getByLabelText("Name"), "Test User");
		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Sign Up" }));

		await waitFor(() => {
			expect(mockSignUpEmail).toHaveBeenCalledWith(
				{
					name: "Test User",
					email: "test@example.com",
					password: "password123",
				},
				expect.objectContaining({
					onSuccess: expect.any(Function),
					onError: expect.any(Function),
				}),
			);
		});
	});

	it("should navigate to /verify-email on successful sign up", async () => {
		mockSignUpEmail.mockImplementation(
			(_data: unknown, callbacks: { onSuccess: () => void }) => {
				callbacks.onSuccess();
			},
		);

		const user = userEvent.setup();
		render(<SignUpForm />);

		await user.type(screen.getByLabelText("Name"), "Test User");
		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Sign Up" }));

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith({
				to: "/verify-email",
				search: { email: "test@example.com" },
			});
		});
	});

	it("should show loading spinner when submitting", async () => {
		mockSignUpEmail.mockImplementation(() => new Promise(() => {}));

		const user = userEvent.setup();
		render(<SignUpForm />);

		await user.type(screen.getByLabelText("Name"), "Test User");
		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Sign Up" }));

		await waitFor(() => {
			const button = screen.getByRole("button", { name: /sign up/i });
			expect(button.querySelector(".animate-spin")).toBeInTheDocument();
		});
	});

	it("should disable inputs when submitting", async () => {
		mockSignUpEmail.mockImplementation(() => new Promise(() => {}));

		const user = userEvent.setup();
		render(<SignUpForm />);

		await user.type(screen.getByLabelText("Name"), "Test User");
		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Sign Up" }));

		await waitFor(() => {
			expect(screen.getByLabelText("Name")).toBeDisabled();
			expect(screen.getByLabelText("Email")).toBeDisabled();
			expect(screen.getByLabelText("Password")).toBeDisabled();
		});
	});
});
