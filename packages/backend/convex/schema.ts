import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	contactMessages: defineTable({
		name: v.string(),
		email: v.string(),
		message: v.string(),
		status: v.union(v.literal("new"), v.literal("read")),
		submittedAt: v.number(),
	})
		.index("by_status", ["status"])
		.index("by_submitted_at", ["submittedAt"]),
});
