import { describe, expect, it } from "vitest";
import { emailSchema, nameSchema, passwordSchema } from "../validations";

describe("emailSchema", () => {
	it("should accept a valid email", () => {
		expect(emailSchema.safeParse("user@example.com").success).toBe(true);
	});

	it("should reject an empty string", () => {
		const result = emailSchema.safeParse("");
		expect(result.success).toBe(false);
	});

	it("should reject a string without @", () => {
		const result = emailSchema.safeParse("notanemail");
		expect(result.success).toBe(false);
	});

	it("should provide custom error message", () => {
		const result = emailSchema.safeParse("bad");
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Invalid email address");
		}
	});
});

describe("passwordSchema", () => {
	it("should accept a string with 8+ characters", () => {
		expect(passwordSchema.safeParse("12345678").success).toBe(true);
	});

	it("should reject a string with fewer than 8 characters", () => {
		const result = passwordSchema.safeParse("short");
		expect(result.success).toBe(false);
	});

	it("should reject an empty string", () => {
		const result = passwordSchema.safeParse("");
		expect(result.success).toBe(false);
	});

	it("should provide custom error message", () => {
		const result = passwordSchema.safeParse("short");
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe(
				"Password must be at least 8 characters",
			);
		}
	});
});

describe("nameSchema", () => {
	it("should accept a string with 2+ characters", () => {
		expect(nameSchema.safeParse("Jo").success).toBe(true);
	});

	it("should reject a single character", () => {
		const result = nameSchema.safeParse("A");
		expect(result.success).toBe(false);
	});

	it("should reject an empty string", () => {
		const result = nameSchema.safeParse("");
		expect(result.success).toBe(false);
	});

	it("should provide custom error message", () => {
		const result = nameSchema.safeParse("A");
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe(
				"Name must be at least 2 characters",
			);
		}
	});
});
