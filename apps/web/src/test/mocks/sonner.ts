import { vi } from "vitest";

export function createSonnerMock() {
	return {
		toast: {
			success: vi.fn(),
			error: vi.fn(),
		},
	};
}
