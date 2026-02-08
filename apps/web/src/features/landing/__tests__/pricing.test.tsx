import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createRouterMock } from "@/test/mocks/router";

vi.mock("@tanstack/react-router", () => createRouterMock());
vi.mock("@/paraglide/messages", () => ({
	landing_pricing_title: () => "Pricing Title",
	landing_pricing_subtitle: () => "Pricing Subtitle",
	landing_pricing_free_title: () => "Open Source",
	landing_pricing_free_price: () => "Free",
	landing_pricing_free_description: () => "Free desc",
	landing_pricing_free_f1: () => "Feature 1",
	landing_pricing_free_f2: () => "Feature 2",
	landing_pricing_free_f3: () => "Feature 3",
	landing_pricing_free_f4: () => "Feature 4",
	landing_pricing_free_cta: () => "Get Started",
	landing_pricing_pro_title: () => "Pro Support",
	landing_pricing_pro_price: () => "$99",
	landing_pricing_pro_period: () => "one-time",
	landing_pricing_pro_description: () => "Pro desc",
	landing_pricing_pro_f1: () => "Pro Feature 1",
	landing_pricing_pro_f2: () => "Pro Feature 2",
	landing_pricing_pro_f3: () => "Pro Feature 3",
	landing_pricing_pro_f4: () => "Pro Feature 4",
	landing_pricing_pro_cta: () => "Get Pro",
	landing_pricing_popular_badge: () => "Popular",
}));

import { Pricing } from "../components/pricing";

describe("Pricing", () => {
	it("should render section title and subtitle", () => {
		render(<Pricing />);
		expect(screen.getByText("Pricing Title")).toBeInTheDocument();
		expect(screen.getByText("Pricing Subtitle")).toBeInTheDocument();
	});

	it("should render both pricing plans", () => {
		render(<Pricing />);
		expect(screen.getByText("Open Source")).toBeInTheDocument();
		expect(screen.getByText("Pro Support")).toBeInTheDocument();
	});

	it("should render Popular badge on Pro plan", () => {
		render(<Pricing />);
		expect(screen.getByText("Popular")).toBeInTheDocument();
	});

	it("should render Pro plan with gradient styling", () => {
		const { container } = render(<Pricing />);
		const proCard = container.querySelector(".ring-2");
		expect(proCard).toBeInTheDocument();
		expect(proCard?.className).toContain("bg-gradient-to-b");
	});

	it("should render pricing section with id", () => {
		const { container } = render(<Pricing />);
		expect(container.querySelector("#pricing")).toBeInTheDocument();
	});

	it("should render features for each plan", () => {
		render(<Pricing />);
		expect(screen.getByText("Feature 1")).toBeInTheDocument();
		expect(screen.getByText("Pro Feature 1")).toBeInTheDocument();
	});

	it("should link CTAs to sign-up", () => {
		render(<Pricing />);
		const links = screen.getAllByRole("link", { name: /Get/ });
		for (const link of links) {
			expect(link).toHaveAttribute("href", "/sign-up");
		}
	});
});
