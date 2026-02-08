import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/paraglide/messages", () => ({
	landing_testimonials_title: () => "Testimonials Title",
	landing_testimonials_subtitle: () => "Testimonials Subtitle",
	landing_testimonial_1_quote: () => "Great template",
	landing_testimonial_1_name: () => "Alex Chen",
	landing_testimonial_1_title: () => "CTO, StartupCo",
	landing_testimonial_2_quote: () => "Amazing TypeScript",
	landing_testimonial_2_name: () => "Sarah Johnson",
	landing_testimonial_2_title: () => "Senior Engineer",
	landing_testimonial_3_quote: () => "Convex is seamless",
	landing_testimonial_3_name: () => "Marcus Rivera",
	landing_testimonial_3_title: () => "Founder, DevStudio",
}));

import { Testimonials } from "../components/testimonials";

describe("Testimonials", () => {
	it("should render section title and subtitle", () => {
		render(<Testimonials />);
		expect(screen.getByText("Testimonials Title")).toBeInTheDocument();
		expect(screen.getByText("Testimonials Subtitle")).toBeInTheDocument();
	});

	it("should render all 3 testimonial cards", () => {
		render(<Testimonials />);
		expect(screen.getByText("Alex Chen")).toBeInTheDocument();
		expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
		expect(screen.getByText("Marcus Rivera")).toBeInTheDocument();
	});

	it("should render 5 star ratings per testimonial", () => {
		const { container } = render(<Testimonials />);
		const stars = container.querySelectorAll(".fill-primary");
		expect(stars).toHaveLength(15); // 5 stars x 3 testimonials
	});

	it("should render avatar initials", () => {
		render(<Testimonials />);
		expect(screen.getByText("AC")).toBeInTheDocument(); // Alex Chen
		expect(screen.getByText("SJ")).toBeInTheDocument(); // Sarah Johnson
		expect(screen.getByText("MR")).toBeInTheDocument(); // Marcus Rivera
	});

	it("should render quotes", () => {
		render(<Testimonials />);
		expect(screen.getByText(/Great template/)).toBeInTheDocument();
		expect(screen.getByText(/Amazing TypeScript/)).toBeInTheDocument();
		expect(screen.getByText(/Convex is seamless/)).toBeInTheDocument();
	});
});
