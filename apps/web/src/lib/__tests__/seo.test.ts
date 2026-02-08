import { describe, expect, it } from "vitest";

import { seo } from "../seo";

describe("seo", () => {
	it("should return default title when no title provided", () => {
		const result = seo({});
		expect(result.meta).toContainEqual({ title: "Acme" });
	});

	it("should append site name to title", () => {
		const result = seo({ title: "Dashboard" });
		expect(result.meta).toContainEqual({ title: "Dashboard | Acme" });
	});

	it("should include og:title matching the full title", () => {
		const result = seo({ title: "Dashboard" });
		expect(result.meta).toContainEqual({
			property: "og:title",
			content: "Dashboard | Acme",
		});
	});

	it("should include description when provided", () => {
		const result = seo({ description: "Welcome" });
		expect(result.meta).toContainEqual({
			name: "description",
			content: "Welcome",
		});
		expect(result.meta).toContainEqual({
			property: "og:description",
			content: "Welcome",
		});
	});

	it("should not include description meta when not provided", () => {
		const result = seo({ title: "Test" });
		const descMeta = result.meta.filter(
			(m) =>
				("name" in m && m.name === "description") ||
				("property" in m && m.property === "og:description"),
		);
		expect(descMeta).toHaveLength(0);
	});

	it("should include og:image when image provided", () => {
		const result = seo({ image: "https://example.com/img.png" });
		expect(result.meta).toContainEqual({
			property: "og:image",
			content: "https://example.com/img.png",
		});
	});

	it("should not include og:image when not provided", () => {
		const result = seo({});
		const imgMeta = result.meta.filter(
			(m) => "property" in m && m.property === "og:image",
		);
		expect(imgMeta).toHaveLength(0);
	});

	it("should include hreflang links when path is provided", () => {
		const result = seo({ title: "Sign In", path: "/sign-in" });
		expect(result.links).toContainEqual({
			rel: "alternate",
			hrefLang: "en",
			href: "/sign-in",
		});
		expect(result.links).toContainEqual({
			rel: "alternate",
			hrefLang: "es",
			href: "/es/sign-in",
		});
		expect(result.links).toContainEqual({
			rel: "alternate",
			hrefLang: "x-default",
			href: "/sign-in",
		});
	});

	it("should return empty links when path is not provided", () => {
		const result = seo({});
		expect(result.links).toEqual([]);
	});
});
