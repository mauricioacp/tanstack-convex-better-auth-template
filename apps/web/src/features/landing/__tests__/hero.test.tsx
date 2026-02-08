import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createRouterMock } from "@/test/mocks/router";

vi.mock("@tanstack/react-router", () => createRouterMock());
vi.mock("@/paraglide/messages", () => ({
	landing_hero_title: () => "Hero Title",
	landing_hero_subtitle: () => "Hero Subtitle",
	landing_hero_cta_primary: () => "Get Started",
	landing_hero_cta_secondary: () => "GitHub",
}));

import { Hero } from "../components/hero";

describe("Hero", () => {
	it("should render the hero title and subtitle", () => {
		render(<Hero />);
		expect(screen.getByText("Hero Title")).toBeInTheDocument();
		expect(screen.getByText("Hero Subtitle")).toBeInTheDocument();
	});

	it("should render both CTA buttons", () => {
		render(<Hero />);
		expect(
			screen.getByRole("link", { name: /Get Started/ }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /GitHub/ })).toBeInTheDocument();
	});

	it("should link primary CTA to sign-up", () => {
		render(<Hero />);
		const link = screen.getByRole("link", { name: /Get Started/ });
		expect(link).toHaveAttribute("href", "/sign-up");
	});

	it("should open GitHub link in new tab", () => {
		render(<Hero />);
		const link = screen.getByRole("link", { name: /GitHub/ });
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
	});
});
