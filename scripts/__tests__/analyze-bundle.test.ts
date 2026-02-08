import { describe, expect, it } from "vitest";

import {
	type AssetInfo,
	type BundleReport,
	formatBytes,
	formatMarkdown,
	generateReport,
} from "../analyze-bundle";

describe("analyze-bundle", () => {
	describe("formatBytes", () => {
		it("should format bytes to KB with 2 decimal places", () => {
			expect(formatBytes(1024)).toBe("1.00 KB");
		});

		it("should format zero bytes", () => {
			expect(formatBytes(0)).toBe("0.00 KB");
		});

		it("should format large values", () => {
			expect(formatBytes(1_048_576)).toBe("1024.00 KB");
		});

		it("should format small values", () => {
			expect(formatBytes(512)).toBe("0.50 KB");
		});
	});

	describe("generateReport", () => {
		it("should return empty report for nonexistent directory", () => {
			const report = generateReport("/nonexistent/path");
			expect(report.assets).toEqual([]);
			expect(report.totalSize).toBe(0);
			expect(report.totalGzip).toBe(0);
		});

		it("should include timestamp and commit", () => {
			const report = generateReport("/nonexistent/path");
			expect(report.timestamp).toBeDefined();
			expect(report.commit).toBeDefined();
		});
	});

	describe("formatMarkdown", () => {
		const mockReport: BundleReport = {
			totalSize: 204_800,
			totalGzip: 102_400,
			assets: [
				{ name: "index-abc123.js", size: 153_600, gzipSize: 76_800 },
				{ name: "style-def456.css", size: 51_200, gzipSize: 25_600 },
			],
			timestamp: "2026-02-08T12:00:00.000Z",
			commit: "abc1234",
		};

		it("should include total sizes in header", () => {
			const md = formatMarkdown(mockReport);
			expect(md).toContain("200.00 KB");
			expect(md).toContain("100.00 KB");
		});

		it("should include asset table with all assets", () => {
			const md = formatMarkdown(mockReport);
			expect(md).toContain("index-abc123.js");
			expect(md).toContain("style-def456.css");
		});

		it("should include table headers", () => {
			const md = formatMarkdown(mockReport);
			expect(md).toContain("| File");
			expect(md).toContain("| Size");
			expect(md).toContain("| Gzip");
		});

		it("should show warning when gzip exceeds threshold", () => {
			const largeReport: BundleReport = {
				...mockReport,
				totalGzip: 600_000,
			};
			const md = formatMarkdown(largeReport);
			expect(md).toContain("Warning");
		});

		it("should not show warning when under threshold", () => {
			const md = formatMarkdown(mockReport);
			expect(md).not.toContain("Warning");
		});

		it("should limit to 10 assets in table", () => {
			const manyAssets: AssetInfo[] = Array.from({ length: 15 }, (_, i) => ({
				name: `chunk-${i}.js`,
				size: 1000,
				gzipSize: 500,
			}));
			const report: BundleReport = {
				...mockReport,
				assets: manyAssets,
			};
			const md = formatMarkdown(report);
			const rows = md.split("\n").filter((line) => line.startsWith("| chunk"));
			expect(rows).toHaveLength(10);
		});

		describe("with baseline comparison", () => {
			const baseline: BundleReport = {
				totalSize: 180_000,
				totalGzip: 90_000,
				assets: [
					{ name: "index-old.js", size: 130_000, gzipSize: 65_000 },
					{ name: "style-old.css", size: 50_000, gzipSize: 25_000 },
				],
				timestamp: "2026-02-07T12:00:00.000Z",
				commit: "old1234",
			};

			it("should show delta when baseline provided", () => {
				const md = formatMarkdown(mockReport, baseline);
				expect(md).toContain("vs main");
			});

			it("should show size increase", () => {
				const md = formatMarkdown(mockReport, baseline);
				expect(md).toContain("+");
			});
		});
	});
});
