import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/paraglide/messages", () => ({
	landing_features_title: () => "Features Title",
	landing_features_subtitle: () => "Features Subtitle",
	landing_feature_auth_title: () => "Auth",
	landing_feature_auth_description: () => "Auth desc",
	landing_feature_realtime_title: () => "Realtime",
	landing_feature_realtime_description: () => "Realtime desc",
	landing_feature_ssr_title: () => "SSR",
	landing_feature_ssr_description: () => "SSR desc",
	landing_feature_typesafe_title: () => "TypeSafe",
	landing_feature_typesafe_description: () => "TypeSafe desc",
	landing_feature_ui_title: () => "UI",
	landing_feature_ui_description: () => "UI desc",
	landing_feature_testing_title: () => "Testing",
	landing_feature_testing_description: () => "Testing desc",
	landing_feature_ci_title: () => "CI/CD",
	landing_feature_ci_description: () => "CI desc",
	landing_feature_edge_title: () => "Edge",
	landing_feature_edge_description: () => "Edge desc",
}));

import { FeaturesGrid } from "../components/features-grid";

describe("FeaturesGrid", () => {
	it("should render the section title and subtitle", () => {
		render(<FeaturesGrid />);
		expect(screen.getByText("Features Title")).toBeInTheDocument();
		expect(screen.getByText("Features Subtitle")).toBeInTheDocument();
	});

	it("should render all 8 feature cards", () => {
		render(<FeaturesGrid />);
		const titles = [
			"Auth",
			"Realtime",
			"SSR",
			"TypeSafe",
			"UI",
			"Testing",
			"CI/CD",
			"Edge",
		];
		for (const title of titles) {
			expect(screen.getByText(title)).toBeInTheDocument();
		}
	});

	it("should render descriptions for each feature", () => {
		render(<FeaturesGrid />);
		expect(screen.getByText("Auth desc")).toBeInTheDocument();
		expect(screen.getByText("Edge desc")).toBeInTheDocument();
	});

	it("should have the features section id", () => {
		const { container } = render(<FeaturesGrid />);
		expect(container.querySelector("#features")).toBeInTheDocument();
	});
});
