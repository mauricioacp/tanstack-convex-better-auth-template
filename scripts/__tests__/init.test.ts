import { describe, expect, it } from "vitest";

import {
	buildReplacementPlan,
	getTargetFiles,
	type InitConfig,
	parseCliArgs,
	replaceInContent,
	toTitleCase,
	validateProjectName,
} from "../init";

describe("validateProjectName", () => {
	it('should accept valid kebab-case like "my-saas"', () => {
		expect(validateProjectName("my-saas")).toBe(true);
	});

	it('should accept single word like "app"', () => {
		expect(validateProjectName("app")).toBe(true);
	});

	it('should accept multi-segment like "my-cool-app"', () => {
		expect(validateProjectName("my-cool-app")).toBe(true);
	});

	it("should reject uppercase letters", () => {
		expect(validateProjectName("My-Saas")).toBe(false);
	});

	it("should reject names starting with a number", () => {
		expect(validateProjectName("123-abc")).toBe(false);
	});

	it("should reject underscores", () => {
		expect(validateProjectName("my_saas")).toBe(false);
	});

	it("should reject empty string", () => {
		expect(validateProjectName("")).toBe(false);
	});

	it("should reject trailing hyphen", () => {
		expect(validateProjectName("my-saas-")).toBe(false);
	});

	it("should reject leading hyphen", () => {
		expect(validateProjectName("-my-saas")).toBe(false);
	});

	it("should reject consecutive hyphens", () => {
		expect(validateProjectName("my--saas")).toBe(false);
	});
});

describe("toTitleCase", () => {
	it('should convert "my-saas" to "My Saas"', () => {
		expect(toTitleCase("my-saas")).toBe("My Saas");
	});

	it('should convert single word "x" to "X"', () => {
		expect(toTitleCase("x")).toBe("X");
	});

	it('should convert "my-cool-app" to "My Cool App"', () => {
		expect(toTitleCase("my-cool-app")).toBe("My Cool App");
	});
});

describe("replaceInContent", () => {
	it("should replace @acme/ scope with new scope in imports", () => {
		const content = 'import { env } from "@acme/env/web";';
		const result = replaceInContent(content, [["@acme/", "@my-saas/"]]);
		expect(result).toBe('import { env } from "@my-saas/env/web";');
	});

	it('should replace display name "Acme" in titles', () => {
		const content = "<title>Acme</title>";
		const result = replaceInContent(content, [["Acme", "My SaaS"]]);
		expect(result).toBe("<title>My SaaS</title>");
	});

	it("should replace alchemy call", () => {
		const content = 'const app = await alchemy("acme");';
		const result = replaceInContent(content, [
			['alchemy("acme")', 'alchemy("my-saas")'],
		]);
		expect(result).toBe('const app = await alchemy("my-saas");');
	});

	it("should handle multiple replacements in one content", () => {
		const content = '@acme/env and title: "Acme"';
		const result = replaceInContent(content, [
			["@acme/", "@my-saas/"],
			["Acme", "My SaaS"],
		]);
		expect(result).toBe('@my-saas/env and title: "My SaaS"');
	});

	it("should produce valid JSON after package.json replacement", () => {
		const content = JSON.stringify(
			{ name: "acme", dependencies: { "@acme/env": "workspace:*" } },
			null,
			2,
		);
		const result = replaceInContent(content, [
			['"name": "acme"', '"name": "my-saas"'],
			["@acme/", "@my-saas/"],
		]);
		expect(() => JSON.parse(result)).not.toThrow();
		const parsed = JSON.parse(result);
		expect(parsed.name).toBe("my-saas");
		expect(parsed.dependencies["@my-saas/env"]).toBe("workspace:*");
	});

	it("should return content unchanged when no matches", () => {
		const content = "no acme references here";
		const result = replaceInContent(content, [["@acme/", "@my-saas/"]]);
		expect(result).toBe(content);
	});
});

describe("parseCliArgs", () => {
	it("should parse --name and --display-name flags", () => {
		const result = parseCliArgs([
			"--name",
			"my-saas",
			"--display-name",
			"My SaaS",
		]);
		expect(result).toEqual({
			name: "my-saas",
			displayName: "My SaaS",
			author: undefined,
			noGit: false,
		});
	});

	it("should return null when no flags provided (interactive mode)", () => {
		const result = parseCliArgs([]);
		expect(result).toBeNull();
	});

	it("should default display name from project name when --display-name omitted", () => {
		const result = parseCliArgs(["--name", "my-saas"]);
		expect(result).toEqual({
			name: "my-saas",
			displayName: "My Saas",
			author: undefined,
			noGit: false,
		});
	});

	it("should parse --author flag", () => {
		const result = parseCliArgs([
			"--name",
			"my-saas",
			"--author",
			"Jane <jane@x.com>",
		]);
		expect(result?.author).toBe("Jane <jane@x.com>");
	});

	it("should parse --no-git flag", () => {
		const result = parseCliArgs(["--name", "my-saas", "--no-git"]);
		expect(result?.noGit).toBe(true);
	});

	it("should throw on invalid project name in CLI mode", () => {
		expect(() => parseCliArgs(["--name", "My-Saas"])).toThrow();
	});
});

describe("getTargetFiles", () => {
	it("should return an array of file paths", () => {
		const files = getTargetFiles();
		expect(Array.isArray(files)).toBe(true);
		expect(files.length).toBeGreaterThan(0);
	});

	it("should include package.json files", () => {
		const files = getTargetFiles();
		expect(files.some((f) => f.endsWith("package.json"))).toBe(true);
	});

	it("should not include node_modules or .agents paths", () => {
		const files = getTargetFiles();
		expect(files.every((f) => !f.includes("node_modules"))).toBe(true);
		expect(files.every((f) => !f.includes(".agents"))).toBe(true);
	});

	it("should not include bun.lock", () => {
		const files = getTargetFiles();
		expect(files.every((f) => !f.endsWith("bun.lock"))).toBe(true);
	});
});

describe("buildReplacementPlan", () => {
	it("should generate scope replacements for package.json files", () => {
		const config: InitConfig = {
			name: "my-saas",
			displayName: "My SaaS",
		};
		const plan = buildReplacementPlan(config);

		const pkgEntry = plan.find((e) => e.file.endsWith("apps/web/package.json"));
		expect(pkgEntry).toBeDefined();
		expect(
			pkgEntry?.replacements.some(
				([from, to]) => from === "@acme/" && to === "@my-saas/",
			),
		).toBe(true);
	});

	it("should generate display name replacements for __root.tsx", () => {
		const config: InitConfig = {
			name: "my-saas",
			displayName: "My SaaS",
		};
		const plan = buildReplacementPlan(config);

		const rootEntry = plan.find((e) => e.file.endsWith("__root.tsx"));
		expect(rootEntry).toBeDefined();
		expect(
			rootEntry?.replacements.some(
				([from, to]) => from === "Acme" && to === "My SaaS",
			),
		).toBe(true);
	});

	it("should generate alchemy replacement for infra file", () => {
		const config: InitConfig = {
			name: "my-saas",
			displayName: "My SaaS",
		};
		const plan = buildReplacementPlan(config);

		const alchemyEntry = plan.find((e) => e.file.endsWith("alchemy.run.ts"));
		expect(alchemyEntry).toBeDefined();
		expect(
			alchemyEntry?.replacements.some(
				([from, to]) =>
					from === 'alchemy("acme")' && to === 'alchemy("my-saas")',
			),
		).toBe(true);
	});

	it("should generate root name replacement for root package.json", () => {
		const config: InitConfig = {
			name: "my-saas",
			displayName: "My SaaS",
		};
		const plan = buildReplacementPlan(config);

		// root package.json should have scope + root name replacements
		const rootPkg = plan.find(
			(e) =>
				e.file.endsWith("package.json") &&
				!e.file.includes("apps/") &&
				!e.file.includes("packages/"),
		);
		expect(rootPkg).toBeDefined();
		expect(
			rootPkg?.replacements.some(
				([from, to]) => from === '"name": "acme"' && to === '"name": "my-saas"',
			),
		).toBe(true);
	});
});
