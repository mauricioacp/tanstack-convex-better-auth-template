import { v } from "convex/values";

import { internal } from "./_generated/api";
import { internalAction, internalQuery, mutation } from "./_generated/server";
import { contactNotificationEmailHtml } from "./emails/contactNotification";
import { rateLimiter } from "./rateLimit";
import { resend } from "./resend";

export const submit = mutation({
	args: {
		name: v.string(),
		email: v.string(),
		message: v.string(),
	},
	returns: v.id("contactMessages"),
	handler: async (ctx, args) => {
		await rateLimiter.limit(ctx, "submitContactForm", {
			key: args.email,
			throws: true,
		});

		const messageId = await ctx.db.insert("contactMessages", {
			name: args.name,
			email: args.email,
			message: args.message,
			status: "new",
			submittedAt: Date.now(),
		});

		await ctx.scheduler.runAfter(0, internal.contactForm.sendNotification, {
			messageId,
		});

		return messageId;
	},
});

export const getMessage = internalQuery({
	args: { id: v.id("contactMessages") },
	returns: v.union(
		v.object({
			name: v.string(),
			email: v.string(),
			message: v.string(),
		}),
		v.null(),
	),
	handler: async (ctx, args) => {
		const message = await ctx.db.get(args.id);
		if (!message) return null;
		return {
			name: message.name,
			email: message.email,
			message: message.message,
		};
	},
});

export const sendNotification = internalAction({
	args: {
		messageId: v.id("contactMessages"),
	},
	handler: async (ctx, args) => {
		const message = await ctx.runQuery(internal.contactForm.getMessage, {
			id: args.messageId,
		});

		if (!message) return;

		const emailFrom = process.env.RESEND_FROM;
		const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL;

		if (!emailFrom || !notifyEmail) return;

		await resend.sendEmail(ctx, {
			from: emailFrom,
			to: notifyEmail,
			subject: `New Contact: ${message.name}`,
			html: contactNotificationEmailHtml(
				message.name,
				message.email,
				message.message,
			),
		});
	},
});
