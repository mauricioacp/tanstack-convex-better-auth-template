import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

let mockIsAuthenticated = false;

vi.mock("@tanstack/react-router", () => ({
	useRouteContext: () => ({ isAuthenticated: mockIsAuthenticated }),
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

vi.mock("@/components/user-menu", () => ({
	default: () => <div data-testid="user-menu">UserMenu</div>,
}));

import Header from "../header";

describe("Header", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockIsAuthenticated = false;
	});

	describe("when unauthenticated", () => {
		it("should render Home link", () => {
			render(<Header />);
			expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
				"href",
				"/",
			);
		});

		it("should render Sign In and Sign Up links", () => {
			render(<Header />);
			const signIn = screen.getByRole("link", { name: "Sign In" });
			const signUp = screen.getByRole("link", { name: "Sign Up" });
			expect(signIn).toHaveAttribute("href", "/sign-in");
			expect(signUp).toHaveAttribute("href", "/sign-up");
		});

		it("should not render Dashboard link", () => {
			render(<Header />);
			expect(
				screen.queryByRole("link", { name: "Dashboard" }),
			).not.toBeInTheDocument();
		});

		it("should not render UserMenu", () => {
			render(<Header />);
			expect(screen.queryByTestId("user-menu")).not.toBeInTheDocument();
		});
	});

	describe("when authenticated", () => {
		beforeEach(() => {
			mockIsAuthenticated = true;
		});

		it("should render Home and Dashboard links", () => {
			render(<Header />);
			expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
				"href",
				"/",
			);
			expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
				"href",
				"/dashboard",
			);
		});

		it("should render UserMenu", () => {
			render(<Header />);
			expect(screen.getByTestId("user-menu")).toBeInTheDocument();
		});

		it("should not render Sign In / Sign Up links", () => {
			render(<Header />);
			expect(
				screen.queryByRole("link", { name: "Sign In" }),
			).not.toBeInTheDocument();
			expect(
				screen.queryByRole("link", { name: "Sign Up" }),
			).not.toBeInTheDocument();
		});
	});
});
