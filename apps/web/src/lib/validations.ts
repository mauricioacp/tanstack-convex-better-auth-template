import z from "zod";

export const emailSchema = z.email("Invalid email address");
export const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters");
export const nameSchema = z
	.string()
	.min(2, "Name must be at least 2 characters");
