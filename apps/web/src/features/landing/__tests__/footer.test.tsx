import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createRouterMock } from "@/test/mocks/router";

vi.mock("@tanstack/react-router", () => createRouterMock());
vi.mock("@/paraglide/messages", () => ({
	landing_footer_description: () => "Footer description",
	landing_footer_product: () => "Product",
	landing_footer_features: () => "Features",
	landing_footer_pricing: () => "Pricing",
	landing_footer_docs: () => "Documentation",
	landing_footer_resources: () => "Resources",
	landing_footer_github: () => "GitHub",
	landing_footer_support: () => "Support",
	landing_footer_changelog: () => "Changelog",
	landing_footer_rights: () => "All rights reserved.",
}));

import { Footer } from "../components/footer";

describe("Footer", () => {
	it("should render the brand name and description", () => {
		render(<Footer />);
		expect(screen.getByText("Acme")).toBeInTheDocument();
		expect(screen.getByText("Footer description")).toBeInTheDocument();
	});

	it("should render product link section", () => {
		render(<Footer />);
		expect(screen.getByText("Product")).toBeInTheDocument();
		expect(screen.getByText("Features")).toBeInTheDocument();
		expect(screen.getByText("Pricing")).toBeInTheDocument();
		expect(screen.getByText("Documentation")).toBeInTheDocument();
	});

	it("should render resource link section", () => {
		render(<Footer />);
		expect(screen.getByText("Resources")).toBeInTheDocument();
		expect(screen.getByText("GitHub")).toBeInTheDocument();
		expect(screen.getByText("Support")).toBeInTheDocument();
		expect(screen.getByText("Changelog")).toBeInTheDocument();
	});

	it("should render copyright with current year", () => {
		render(<Footer />);
		const year = new Date().getFullYear();
		expect(screen.getByText(new RegExp(`© ${year} Acme`))).toBeInTheDocument();
	});

	it("should open external links in new tab", () => {
		render(<Footer />);
		const githubLink = screen.getByText("GitHub");
		expect(githubLink).toHaveAttribute("target", "_blank");
		expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
	});
});
