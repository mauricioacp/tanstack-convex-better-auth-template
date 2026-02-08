import { vi } from "vitest";

import type { Theme } from "@/lib/theme-provider";

export const mockSetTheme = vi.fn();

export function createThemeMock(theme: Theme = "system") {
	return {
		useTheme: () => ({
			theme,
			setTheme: mockSetTheme,
		}),
		ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
	};
}
