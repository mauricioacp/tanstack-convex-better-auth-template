import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins/email-otp";
import type { GenericMutationCtx } from "convex/server";
import { v } from "convex/values";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";
import { otpVerificationEmailHtml } from "./emails/otpVerification";
import { resetPasswordEmailHtml } from "./emails/resetPassword";
import { rateLimiter } from "./rateLimit";
import { resend } from "./resend";

const siteUrl = process.env.SITE_URL as string;
const emailFrom = process.env.RESEND_FROM as string;

if (!siteUrl) {
	throw new Error("SITE_URL must be set");
}

if (!emailFrom) {
	throw new Error("RESEND_FROM must be set");
}

export const authComponent = createClient<DataModel>(components.betterAuth);

function createAuth(ctx: GenericCtx<DataModel>) {
	// Better Auth HTTP handlers always run in mutation context,
	// so ctx will have runMutation at runtime.
	const mutationCtx = ctx as GenericMutationCtx<DataModel>;

	return betterAuth({
		baseURL: siteUrl,
		trustedOrigins: [siteUrl],
		database: authComponent.adapter(ctx),
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: true,
			sendResetPassword: async ({ user, url }) => {
				await rateLimiter.limit(mutationCtx, "sendResetPassword", {
					key: user.email,
					throws: true,
				});
				await resend.sendEmail(mutationCtx, {
					from: emailFrom,
					to: user.email,
					subject: "Reset Your Password — Acme",
					html: resetPasswordEmailHtml(url, user.name),
				});
			},
		},
		plugins: [
			convex({
				authConfig,
				jwksRotateOnTokenGenerationError: true,
			}),
			emailOTP({
				otpLength: 6,
				expiresIn: 600,
				sendVerificationOnSignUp: true,
				sendVerificationOTP: async ({ email, otp }) => {
					await rateLimiter.limit(mutationCtx, "sendVerificationOTP", {
						key: email,
						throws: true,
					});
					await resend.sendEmail(mutationCtx, {
						from: emailFrom,
						to: email,
						subject: "Verify Your Email — Acme",
						html: otpVerificationEmailHtml(otp, email),
					});
				},
			}),
		],
	});
}

export { createAuth };

export const getCurrentUser = query({
	args: {},
	returns: v.any(),
	handler: async (ctx) => {
		return (await authComponent.safeGetAuthUser(ctx)) ?? null;
	},
});
