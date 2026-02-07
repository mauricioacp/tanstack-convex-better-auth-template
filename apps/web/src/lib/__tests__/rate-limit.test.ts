import { describe, expect, it } from "vitest";

import { parseAuthError } from "../rate-limit";

describe("parseAuthError", () => {
	it("should detect rate limit from 429 status", () => {
		const result = parseAuthError({
			error: {
				status: 429,
				message: "Too many requests",
				statusText: "Too Many Requests",
			},
		});
		expect(result.isRateLimited).toBe(true);
		expect(result.message).toBe("Too many requests");
	});

	it("should extract retryAfter when present", () => {
		const result = parseAuthError({
			error: { status: 429, message: "Rate limited", retryAfter: 42 },
		});
		expect(result.isRateLimited).toBe(true);
		expect(result.retryAfter).toBe(42);
	});

	it("should detect rate limit from message containing 'rate limit'", () => {
		const result = parseAuthError({
			error: { status: 400, message: "rate limit exceeded" },
		});
		expect(result.isRateLimited).toBe(true);
	});

	it("should detect rate limit from message containing 'too many'", () => {
		const result = parseAuthError({
			error: { status: 500, message: "Too many attempts" },
		});
		expect(result.isRateLimited).toBe(true);
	});

	it("should return non-rate-limited for regular errors", () => {
		const result = parseAuthError({
			error: { status: 401, message: "Invalid credentials" },
		});
		expect(result.isRateLimited).toBe(false);
		expect(result.retryAfter).toBeNull();
		expect(result.message).toBe("Invalid credentials");
	});

	it("should handle missing fields gracefully", () => {
		const result = parseAuthError({});
		expect(result.isRateLimited).toBe(false);
		expect(result.retryAfter).toBeNull();
		expect(result.message).toBe("An error occurred");
	});

	it("should provide default retryAfter when rate limited but retryAfter missing", () => {
		const result = parseAuthError({
			error: { status: 429, message: "Too many requests" },
		});
		expect(result.isRateLimited).toBe(true);
		expect(result.retryAfter).toBe(60);
	});

	it("should handle retryAfter in nested data field", () => {
		const result = parseAuthError({
			error: { status: 429, message: "Rate limited", data: { retryAfter: 30 } },
		});
		expect(result.isRateLimited).toBe(true);
		expect(result.retryAfter).toBe(30);
	});
});
