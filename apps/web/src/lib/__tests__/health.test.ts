import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.stubGlobal("__BUILD_COMMIT__", "abc1234");
vi.stubGlobal("__BUILD_TIME__", "2026-02-08T12:00:00.000Z");
vi.stubGlobal("__APP_VERSION__", "0.1.0");

describe("health", () => {
	let health: typeof import("../health");

	beforeEach(async () => {
		vi.useFakeTimers();
		// Fresh module import each test to reset APP_START_TIME
		health = await import("../health");
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.resetModules();
	});

	describe("getUptime", () => {
		it("should return 0 immediately after module load", () => {
			expect(health.getUptime()).toBe(0);
		});

		it("should return elapsed seconds since module load", () => {
			vi.advanceTimersByTime(5000);
			expect(health.getUptime()).toBe(5);
		});

		it("should floor partial seconds", () => {
			vi.advanceTimersByTime(2500);
			expect(health.getUptime()).toBe(2);
		});
	});

	describe("buildHealthResponse", () => {
		it("should return correct shape with all fields", () => {
			const response = health.buildHealthResponse();

			expect(response).toEqual({
				status: "ok",
				version: "0.1.0",
				commit: "abc1234",
				buildTime: "2026-02-08T12:00:00.000Z",
				uptime: expect.any(Number),
			});
		});

		it("should always return status ok", () => {
			expect(health.buildHealthResponse().status).toBe("ok");
		});

		it("should include build metadata from globals", () => {
			const response = health.buildHealthResponse();
			expect(response.version).toBe("0.1.0");
			expect(response.commit).toBe("abc1234");
			expect(response.buildTime).toBe("2026-02-08T12:00:00.000Z");
		});

		it("should include current uptime", () => {
			vi.advanceTimersByTime(10_000);
			expect(health.buildHealthResponse().uptime).toBe(10);
		});
	});
});
