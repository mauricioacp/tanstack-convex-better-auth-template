import { MINUTE, RateLimiter } from "@convex-dev/rate-limiter";

import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
	sendVerificationOTP: { kind: "token bucket", rate: 3, period: 5 * MINUTE },
	sendResetPassword: { kind: "token bucket", rate: 2, period: 10 * MINUTE },
	submitContactForm: { kind: "token bucket", rate: 3, period: 15 * MINUTE },
});
