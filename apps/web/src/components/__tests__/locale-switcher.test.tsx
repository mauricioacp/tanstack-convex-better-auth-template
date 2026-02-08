import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRouterMock } from "@/test/mocks/router";

vi.mock("@tanstack/react-router", () =>
	createRouterMock(
		{},
		{
			location: {
				pathname: "/sign-in",
				searchStr: "?next=%2Fdashboard",
				hash: "#section",
			},
		},
	),
);

let mockLocale = "en";

vi.mock("@/paraglide/runtime.js", () => ({
	getLocale: () => mockLocale,
	locales: ["en", "es"] as const,
	localizeHref: (href: string, opts?: { locale?: string }) =>
		opts?.locale === "es" ? `/es${href}` : href,
}));

import LocaleSwitcher from "../locale-switcher";

describe("LocaleSwitcher", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockLocale = "en";
	});

	it("should render a link for each locale", () => {
		render(<LocaleSwitcher />);
		expect(screen.getByRole("link", { name: "EN" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "ES" })).toBeInTheDocument();
	});

	it("should preserve current route when switching locales", () => {
		render(<LocaleSwitcher />);
		expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
			"href",
			"/sign-in?next=%2Fdashboard#section",
		);
		expect(screen.getByRole("link", { name: "ES" })).toHaveAttribute(
			"href",
			"/es/sign-in?next=%2Fdashboard#section",
		);
	});

	it("should apply default variant to current locale when English", () => {
		render(<LocaleSwitcher />);
		const enLink = screen.getByRole("link", { name: "EN" });
		const esLink = screen.getByRole("link", { name: "ES" });
		// Current locale (EN) gets "default" variant, other gets "ghost"
		expect(enLink.className).not.toEqual(esLink.className);
	});

	it("should apply default variant to current locale when Spanish", () => {
		mockLocale = "es";
		render(<LocaleSwitcher />);
		const enLink = screen.getByRole("link", { name: "EN" });
		const esLink = screen.getByRole("link", { name: "ES" });
		// Current locale (ES) gets "default" variant, EN gets "ghost"
		expect(enLink.className).not.toEqual(esLink.className);
	});
});
