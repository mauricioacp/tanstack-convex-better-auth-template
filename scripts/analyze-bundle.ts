#!/usr/bin/env bun
/**
 * Bundle size analysis script.
 * Reads the built client assets and reports sizes (raw + gzip).
 *
 * Usage:
 *   bun run analyze-bundle                            # JSON output (default)
 *   bun run analyze-bundle apps/web/dist markdown     # Markdown output
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

// ── Types ────────────────────────────────────────────────────────────────

export type AssetInfo = {
	name: string;
	size: number;
	gzipSize: number;
};

export type BundleReport = {
	totalSize: number;
	totalGzip: number;
	assets: AssetInfo[];
	timestamp: string;
	commit: string;
};

// ── Constants ────────────────────────────────────────────────────────────

const GZIP_WARNING_THRESHOLD = 500 * 1024; // 500 KB
const MAX_TABLE_ROWS = 10;

// ── Functions ────────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
	return `${(bytes / 1024).toFixed(2)} KB`;
}

function analyzeAssets(distPath: string): AssetInfo[] {
	const assetsPath = join(distPath, "client", "assets");

	if (!existsSync(assetsPath)) {
		return [];
	}

	const files = readdirSync(assetsPath);

	return files
		.filter((f) => f.endsWith(".js") || f.endsWith(".css"))
		.map((name) => {
			const filePath = join(assetsPath, name);
			const content = readFileSync(filePath);
			const size = statSync(filePath).size;
			const gzipSize = gzipSync(content).length;

			return { name, size, gzipSize };
		})
		.sort((a, b) => b.size - a.size);
}

export function generateReport(distPath: string): BundleReport {
	const assets = analyzeAssets(distPath);
	const totalSize = assets.reduce((sum, a) => sum + a.size, 0);
	const totalGzip = assets.reduce((sum, a) => sum + a.gzipSize, 0);

	return {
		totalSize,
		totalGzip,
		assets,
		timestamp: new Date().toISOString(),
		commit: process.env.GITHUB_SHA?.slice(0, 7) ?? "local",
	};
}

export function formatMarkdown(
	report: BundleReport,
	baseline?: BundleReport,
): string {
	const lines: string[] = [];

	lines.push("## Bundle Size Report\n");
	lines.push(
		`**Total**: ${formatBytes(report.totalSize)} (${formatBytes(report.totalGzip)} gzip)`,
	);

	if (baseline) {
		const delta = report.totalGzip - baseline.totalGzip;
		const sign = delta > 0 ? "+" : "";
		const percent = baseline.totalGzip
			? ((delta / baseline.totalGzip) * 100).toFixed(1)
			: "N/A";
		lines.push(
			`**vs main**: ${sign}${formatBytes(delta)} (${sign}${percent}%)`,
		);
	}

	lines.push("");

	if (report.totalGzip > GZIP_WARNING_THRESHOLD) {
		lines.push(
			`> **Warning**: Bundle exceeds ${formatBytes(GZIP_WARNING_THRESHOLD)} gzip threshold\n`,
		);
	}

	lines.push("| File | Size | Gzip |");
	lines.push("|------|------|------|");

	for (const asset of report.assets.slice(0, MAX_TABLE_ROWS)) {
		lines.push(
			`| ${asset.name} | ${formatBytes(asset.size)} | ${formatBytes(asset.gzipSize)} |`,
		);
	}

	if (report.assets.length > MAX_TABLE_ROWS) {
		lines.push(
			`\n*...and ${report.assets.length - MAX_TABLE_ROWS} more assets*`,
		);
	}

	lines.push("");

	return lines.join("\n");
}

// ── CLI ──────────────────────────────────────────────────────────────────

const isMain = process.argv[1]?.endsWith("analyze-bundle.ts");

if (isMain) {
	const distPath = process.argv[2] || "./apps/web/dist";
	const outputFormat = process.argv[3] || "json";

	const report = generateReport(distPath);

	if (outputFormat === "markdown") {
		console.log(formatMarkdown(report));
	} else {
		console.log(JSON.stringify(report, null, 2));
	}
}
