import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRouterMock } from "@/test/mocks/router";

const { mockContext, mockLocation } = vi.hoisted(() => ({
	mockContext: { isAuthenticated: false },
	mockLocation: { pathname: "/" },
}));

vi.mock("@tanstack/react-router", () =>
	createRouterMock(mockContext, { location: mockLocation }),
);

vi.mock("@/features/auth/components/user-menu", () => ({
	default: () => <div data-testid="user-menu">UserMenu</div>,
}));

vi.mock("@/lib/theme-provider", () => ({
	useTheme: () => ({ theme: "system", setTheme: vi.fn() }),
}));

import Header from "../header";

describe("Header", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockContext.isAuthenticated = false;
		mockLocation.pathname = "/";
	});

	describe("when unauthenticated (landing header)", () => {
		it("should render logo linking to home", () => {
			render(<Header />);
			const logo = screen.getByRole("link", { name: "Acme" });
			expect(logo).toHaveAttribute("href", "/");
		});

		it("should render anchor links for Features, Pricing, Contact", () => {
			render(<Header />);
			expect(screen.getByRole("link", { name: "Features" })).toHaveAttribute(
				"href",
				"#features",
			);
			expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute(
				"href",
				"#pricing",
			);
			expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
				"href",
				"#contact",
			);
		});

		it("should render Sign In and Sign Up links", () => {
			render(<Header />);
			expect(screen.getByRole("link", { name: "Sign In" })).toHaveAttribute(
				"href",
				"/sign-in",
			);
			expect(screen.getByRole("link", { name: "Sign Up" })).toHaveAttribute(
				"href",
				"/sign-up",
			);
		});

		it("should not render Dashboard or Settings nav tabs", () => {
			render(<Header />);
			expect(
				screen.queryByRole("link", { name: "Dashboard" }),
			).not.toBeInTheDocument();
			expect(
				screen.queryByRole("link", { name: "Settings" }),
			).not.toBeInTheDocument();
		});

		it("should not render UserMenu", () => {
			render(<Header />);
			expect(screen.queryByTestId("user-menu")).not.toBeInTheDocument();
		});

		it("should render floating header with glassmorphism classes", () => {
			render(<Header />);
			const header = screen.getByRole("banner");
			expect(header.className).toContain("fixed");
			expect(header.className).toContain("z-50");
		});

		it("should render glassmorphism inner container with backdrop-blur", () => {
			render(<Header />);
			const header = screen.getByRole("banner");
			const inner = header.firstElementChild as HTMLElement;
			expect(inner.className).toContain("backdrop-blur");
		});
	});

	describe("when authenticated (app header)", () => {
		beforeEach(() => {
			mockContext.isAuthenticated = true;
			mockLocation.pathname = "/dashboard";
		});

		it("should render logo linking to home", () => {
			render(<Header />);
			const logo = screen.getByRole("link", { name: "Acme" });
			expect(logo).toHaveAttribute("href", "/");
		});

		it("should render Dashboard and Settings nav tabs", () => {
			render(<Header />);
			expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
				"href",
				"/dashboard",
			);
			expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
				"href",
				"/settings",
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

		it("should not render anchor links", () => {
			render(<Header />);
			expect(
				screen.queryByRole("link", { name: "Features" }),
			).not.toBeInTheDocument();
			expect(
				screen.queryByRole("link", { name: "Pricing" }),
			).not.toBeInTheDocument();
			expect(
				screen.queryByRole("link", { name: "Contact" }),
			).not.toBeInTheDocument();
		});

		it("should render sticky header (not floating)", () => {
			render(<Header />);
			const header = screen.getByRole("banner");
			expect(header.className).toContain("sticky");
			expect(header.className).not.toContain("fixed");
		});

		it("should apply active state to current route tab", () => {
			mockLocation.pathname = "/dashboard";
			render(<Header />);
			const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
			expect(dashboardLink.className).toContain("bg-muted");
		});

		it("should not apply active state to non-current route tab", () => {
			mockLocation.pathname = "/dashboard";
			render(<Header />);
			const settingsLink = screen.getByRole("link", { name: "Settings" });
			expect(settingsLink.className).not.toContain("bg-muted");
		});
	});
});
