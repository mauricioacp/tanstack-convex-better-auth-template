const RATE_LIMIT_PATTERNS = /rate.?limit|too many/i;
const DEFAULT_RETRY_AFTER = 60;

interface AuthErrorLike {
	error?: {
		status?: number;
		message?: string;
		statusText?: string;
		retryAfter?: number;
		data?: { retryAfter?: number };
	};
}

interface ParsedAuthError {
	isRateLimited: boolean;
	retryAfter: number | null;
	message: string;
}

export function parseAuthError(error: AuthErrorLike): ParsedAuthError {
	const status = error?.error?.status;
	const message =
		error?.error?.message || error?.error?.statusText || "An error occurred";
	const isRateLimited = status === 429 || RATE_LIMIT_PATTERNS.test(message);

	const retryAfter = isRateLimited
		? (error?.error?.retryAfter ??
			error?.error?.data?.retryAfter ??
			DEFAULT_RETRY_AFTER)
		: null;

	return { isRateLimited, retryAfter, message };
}
