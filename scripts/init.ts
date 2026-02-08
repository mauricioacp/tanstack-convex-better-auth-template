#!/usr/bin/env bun
/**
 * Template initialization script.
 * Replaces all "acme" / "Acme" / "@acme/" references with a user-chosen project name.
 * Supports interactive prompts (default) or CLI flags for CI/automation.
 *
 * Usage:
 *   bun run init                                          # interactive
 *   bun run init --name my-saas --display-name "My SaaS"  # non-interactive
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline";
import { parseArgs } from "node:util";

// ── Types ────────────────────────────────────────────────────────────────

export type InitConfig = {
	name: string;
	displayName: string;
	author?: string;
	noGit?: boolean;
};

type ReplacementEntry = {
	file: string;
	replacements: [string, string][];
};

// ── Pure functions (exported for testing) ────────────────────────────────

const KEBAB_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

export function validateProjectName(name: string): boolean {
	return KEBAB_RE.test(name);
}

export function toTitleCase(kebab: string): string {
	return kebab
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

export function replaceInContent(
	content: string,
	replacements: [string, string][],
): string {
	let result = content;
	for (const [from, to] of replacements) {
		result = result.replaceAll(from, to);
	}
	return result;
}

export function parseCliArgs(args: string[]): InitConfig | null {
	if (args.length === 0) return null;

	const { values } = parseArgs({
		args,
		options: {
			name: { type: "string" },
			"display-name": { type: "string" },
			author: { type: "string" },
			"no-git": { type: "boolean", default: false },
		},
		strict: true,
	});

	if (!values.name) return null;

	if (!validateProjectName(values.name)) {
		throw new Error(
			`Invalid project name "${values.name}". Must be kebab-case (e.g. "my-saas").`,
		);
	}

	return {
		name: values.name,
		displayName: values["display-name"] || toTitleCase(values.name),
		author: values.author,
		noGit: values["no-git"] ?? false,
	};
}

const ROOT = resolve(import.meta.dirname, "..");

/**
 * Returns the list of files that contain acme/Acme references and need replacement.
 * Paths are relative to the monorepo root.
 */
export function getTargetFiles(): string[] {
	return [
		// Group A — Scope (@acme/ -> @{name}/)
		"package.json",
		"apps/web/package.json",
		"packages/backend/package.json",
		"packages/env/package.json",
		"packages/config/package.json",
		"packages/infra/package.json",
		"tsconfig.json",
		"packages/env/tsconfig.json",
		"apps/web/src/router.tsx",
		"apps/web/src/lib/auth-server.ts",
		"apps/web/src/routes/index.tsx",
		"apps/web/src/routes/dashboard.tsx",
		"apps/web/src/components/user-menu.tsx",
		"apps/web/src/components/__tests__/user-menu.test.tsx",
		"CLAUDE.md",

		// Group B — Display name (Acme -> {displayName})
		"apps/web/src/routes/__root.tsx",
		"packages/backend/convex/auth.ts",
		"packages/backend/convex/emails/otpVerification.ts",
		"packages/backend/convex/emails/resetPassword.ts",
		"README.md",

		// Group D — Infra
		"packages/infra/alchemy.run.ts",
	];
}

/**
 * Builds a per-file replacement plan based on the config.
 * Each entry tells which strings to swap in which file.
 */
export function buildReplacementPlan(config: InitConfig): ReplacementEntry[] {
	const { name, displayName } = config;
	const scopeReplace: [string, string] = ["@acme/", `@${name}/`];
	const displayReplace: [string, string] = ["Acme", displayName];
	const alchemyReplace: [string, string] = [
		'alchemy("acme")',
		`alchemy("${name}")`,
	];
	const rootNameReplace: [string, string] = [
		'"name": "acme"',
		`"name": "${name}"`,
	];

	const plan: ReplacementEntry[] = [];

	// Group A — scope in package.json files
	const scopePackageFiles = [
		"apps/web/package.json",
		"packages/backend/package.json",
		"packages/env/package.json",
		"packages/config/package.json",
		"packages/infra/package.json",
	];
	for (const file of scopePackageFiles) {
		plan.push({ file, replacements: [scopeReplace] });
	}

	// Root package.json — scope + root name + turbo filter refs
	plan.push({
		file: "package.json",
		replacements: [scopeReplace, rootNameReplace],
	});

	// Scope in tsconfig files
	for (const file of ["tsconfig.json", "packages/env/tsconfig.json"]) {
		plan.push({ file, replacements: [scopeReplace] });
	}

	// Scope in source files
	const scopeSourceFiles = [
		"apps/web/src/router.tsx",
		"apps/web/src/lib/auth-server.ts",
		"apps/web/src/routes/index.tsx",
		"apps/web/src/routes/dashboard.tsx",
		"apps/web/src/components/user-menu.tsx",
		"apps/web/src/components/__tests__/user-menu.test.tsx",
	];
	for (const file of scopeSourceFiles) {
		plan.push({ file, replacements: [scopeReplace] });
	}

	// Scope in CLAUDE.md
	plan.push({ file: "CLAUDE.md", replacements: [scopeReplace] });

	// Group B — display name
	plan.push({
		file: "apps/web/src/routes/__root.tsx",
		replacements: [displayReplace],
	});
	plan.push({
		file: "packages/backend/convex/auth.ts",
		replacements: [displayReplace],
	});
	plan.push({
		file: "packages/backend/convex/emails/otpVerification.ts",
		replacements: [displayReplace],
	});
	plan.push({
		file: "packages/backend/convex/emails/resetPassword.ts",
		replacements: [displayReplace],
	});

	// README — display name + project structure diagram
	plan.push({
		file: "README.md",
		replacements: [displayReplace, ["acme/", `${name}/`]],
	});

	// Group D — alchemy
	plan.push({
		file: "packages/infra/alchemy.run.ts",
		replacements: [alchemyReplace],
	});

	return plan;
}

// ── Side-effectful functions (main flow) ─────────────────────────────────

async function prompt(question: string): Promise<string> {
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer.trim());
		});
	});
}

async function getInteractiveConfig(): Promise<InitConfig> {
	let name = "";
	while (!validateProjectName(name)) {
		name = await prompt("? Project name (kebab-case): ");
		if (!validateProjectName(name)) {
			console.log('  Invalid name. Use kebab-case (e.g. "my-saas").');
		}
	}

	const defaultDisplay = toTitleCase(name);
	const displayInput = await prompt(`? Display name [${defaultDisplay}]: `);
	const displayName = displayInput || defaultDisplay;

	const author = (await prompt("? Author (optional): ")) || undefined;

	return { name, displayName, author };
}

function applyReplacements(plan: ReplacementEntry[]) {
	for (const { file, replacements } of plan) {
		const absPath = join(ROOT, file);
		if (!existsSync(absPath)) {
			console.log(`  skip (not found): ${file}`);
			continue;
		}
		const original = readFileSync(absPath, "utf-8");
		const updated = replaceInContent(original, replacements);
		if (updated !== original) {
			writeFileSync(absPath, updated);
			console.log(`  updated: ${file}`);
		}
	}
}

function resetVersions() {
	const pkgFiles = [
		"package.json",
		"apps/web/package.json",
		"packages/backend/package.json",
	];
	for (const rel of pkgFiles) {
		const absPath = join(ROOT, rel);
		if (!existsSync(absPath)) continue;
		const content = readFileSync(absPath, "utf-8");
		const pkg = JSON.parse(content);
		if (pkg.version && pkg.version !== "0.0.0") {
			pkg.version = "0.0.0";
			writeFileSync(absPath, `${JSON.stringify(pkg, null, "\t")}\n`);
			console.log(`  reset version: ${rel}`);
		}
	}
}

function clearChangelog() {
	const changelogPath = join(ROOT, "CHANGELOG.md");
	if (existsSync(changelogPath)) {
		writeFileSync(
			changelogPath,
			"# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nSee [Conventional Commits](https://conventionalcommits.org) for commit guidelines.\n",
		);
		console.log("  cleared: CHANGELOG.md");
	}
}

function deleteBtsConfig() {
	const btsPath = join(ROOT, "bts.jsonc");
	if (existsSync(btsPath)) {
		rmSync(btsPath);
		console.log("  deleted: bts.jsonc");
	}
}

function setAuthor(author: string) {
	const pkgFiles = [
		"package.json",
		"apps/web/package.json",
		"packages/backend/package.json",
		"packages/env/package.json",
		"packages/config/package.json",
		"packages/infra/package.json",
	];
	for (const rel of pkgFiles) {
		const absPath = join(ROOT, rel);
		if (!existsSync(absPath)) continue;
		const content = readFileSync(absPath, "utf-8");
		const pkg = JSON.parse(content);
		pkg.author = author;
		writeFileSync(absPath, `${JSON.stringify(pkg, null, "\t")}\n`);
	}
	console.log(`  set author: "${author}" in ${pkgFiles.length} files`);
}

async function handleGitOperations(config: InitConfig) {
	if (config.noGit) return;

	const gitDir = join(ROOT, ".git");
	if (!existsSync(gitDir)) return;

	const removeRemote = await prompt("? Remove git remote origin? (y/N): ");
	if (removeRemote.toLowerCase() === "y") {
		try {
			// Safe: hardcoded command, no user input interpolation
			execSync("git remote remove origin", { cwd: ROOT, stdio: "pipe" });
			console.log("  removed git remote origin");
		} catch {
			console.log("  no remote origin to remove");
		}
	}

	const reinitGit = await prompt("? Reinitialize git history? (y/N): ");
	if (reinitGit.toLowerCase() === "y") {
		rmSync(gitDir, { recursive: true, force: true });
		// Safe: all hardcoded commands, no user input interpolation
		execSync("git init", { cwd: ROOT, stdio: "pipe" });
		execSync("git add -A", { cwd: ROOT, stdio: "pipe" });
		execSync('git commit -m "Initial commit"', {
			cwd: ROOT,
			stdio: "pipe",
		});
		console.log("  reinitialized git repository");
	}
}

function selfDelete() {
	const scriptPath = join(ROOT, "scripts/init.ts");

	// Remove "init" script from root package.json
	const pkgPath = join(ROOT, "package.json");
	const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
	if (pkg.scripts?.init) {
		delete pkg.scripts.init;
		writeFileSync(pkgPath, `${JSON.stringify(pkg, null, "\t")}\n`);
		console.log('  removed "init" script from package.json');
	}

	// Delete test file
	const testPath = join(ROOT, "scripts/__tests__/init.test.ts");
	if (existsSync(testPath)) {
		rmSync(testPath);
	}

	// Delete __tests__ dir if empty
	const testDir = join(ROOT, "scripts/__tests__");
	if (existsSync(testDir)) {
		try {
			rmSync(testDir, { recursive: true });
		} catch {
			// not empty, leave it
		}
	}

	// Delete this script
	if (existsSync(scriptPath)) {
		rmSync(scriptPath);
	}

	// Delete scripts/ dir if empty
	const scriptsDir = join(ROOT, "scripts");
	try {
		rmSync(scriptsDir, { recursive: true });
		console.log("  self-deleted scripts/");
	} catch {
		// not empty, leave it
	}
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
	console.log("\n  Template Initialization\n");

	// 1. Get config (CLI flags or interactive)
	const cliConfig = parseCliArgs(process.argv.slice(2));
	const config = cliConfig ?? (await getInteractiveConfig());

	console.log(`\n  Project: ${config.name}`);
	console.log(`  Display: ${config.displayName}`);
	if (config.author) console.log(`  Author:  ${config.author}`);
	console.log();

	// 2. Apply replacements
	console.log("Replacing references...");
	const plan = buildReplacementPlan(config);
	applyReplacements(plan);

	// 3. Post-replacement operations
	console.log("\nPost-setup...");
	resetVersions();
	clearChangelog();
	deleteBtsConfig();
	if (config.author) setAuthor(config.author);

	// 4. Git operations
	await handleGitOperations(config);

	// 5. Reinstall dependencies
	console.log("\nReinstalling dependencies...");
	// Safe: hardcoded command, no user input
	execSync("bun install", { cwd: ROOT, stdio: "inherit" });

	// 6. Self-delete
	console.log("\nCleaning up...");
	selfDelete();

	console.log("\nDone! Next steps:");
	console.log("  bun run dev:setup    # configure Convex");
	console.log("  bun run dev          # start developing\n");
}

// Only run main when executed directly (not imported by tests)
const isDirectRun =
	process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename);
if (isDirectRun) {
	main().catch((err) => {
		console.error(err.message);
		process.exit(1);
	});
}
