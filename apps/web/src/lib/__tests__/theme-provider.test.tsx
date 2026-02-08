import { act, render, renderHook, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider, useTheme } from "../theme-provider";

// Mock matchMedia
function createMatchMediaMock(matches = false) {
	const listeners: Array<(e: MediaQueryListEvent) => void> = [];
	const mql = {
		matches,
		media: "(prefers-color-scheme: dark)",
		addEventListener: vi.fn(
			(_event: string, cb: (e: MediaQueryListEvent) => void) => {
				listeners.push(cb);
			},
		),
		removeEventListener: vi.fn(
			(_event: string, cb: (e: MediaQueryListEvent) => void) => {
				const index = listeners.indexOf(cb);
				if (index > -1) listeners.splice(index, 1);
			},
		),
	};

	return {
		mql,
		listeners,
		trigger: (newMatches: boolean) => {
			mql.matches = newMatches;
			for (const listener of listeners) {
				listener({ matches: newMatches } as MediaQueryListEvent);
			}
		},
	};
}

function wrapper({ children }: { children: ReactNode }) {
	return <ThemeProvider>{children}</ThemeProvider>;
}

describe("ThemeProvider", () => {
	let matchMediaMock: ReturnType<typeof createMatchMediaMock>;

	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
		document.documentElement.classList.remove("light", "dark");

		matchMediaMock = createMatchMediaMock(false);
		vi.stubGlobal(
			"matchMedia",
			vi.fn(() => matchMediaMock.mql),
		);
	});

	describe("initialization", () => {
		it("should default to system theme", () => {
			const { result } = renderHook(() => useTheme(), { wrapper });
			expect(result.current.theme).toBe("system");
		});

		it("should read theme from localStorage on mount", () => {
			localStorage.setItem("theme", "dark");
			const { result } = renderHook(() => useTheme(), { wrapper });
			expect(result.current.theme).toBe("dark");
		});

		it("should use defaultTheme prop when no localStorage value", () => {
			const customWrapper = ({ children }: { children: ReactNode }) => (
				<ThemeProvider defaultTheme="light">{children}</ThemeProvider>
			);
			const { result } = renderHook(() => useTheme(), {
				wrapper: customWrapper,
			});
			expect(result.current.theme).toBe("light");
		});
	});

	describe("class application", () => {
		it("should apply dark class when system prefers dark", () => {
			matchMediaMock = createMatchMediaMock(true);
			vi.stubGlobal(
				"matchMedia",
				vi.fn(() => matchMediaMock.mql),
			);

			renderHook(() => useTheme(), { wrapper });
			expect(document.documentElement.classList.contains("dark")).toBe(true);
		});

		it("should apply light class when system prefers light", () => {
			matchMediaMock = createMatchMediaMock(false);
			vi.stubGlobal(
				"matchMedia",
				vi.fn(() => matchMediaMock.mql),
			);

			renderHook(() => useTheme(), { wrapper });
			expect(document.documentElement.classList.contains("light")).toBe(true);
		});

		it("should apply dark class when theme is dark", () => {
			localStorage.setItem("theme", "dark");
			renderHook(() => useTheme(), { wrapper });
			expect(document.documentElement.classList.contains("dark")).toBe(true);
		});

		it("should apply light class when theme is light", () => {
			localStorage.setItem("theme", "light");
			renderHook(() => useTheme(), { wrapper });
			expect(document.documentElement.classList.contains("light")).toBe(true);
		});
	});

	describe("setTheme", () => {
		it("should update theme to dark", () => {
			const { result } = renderHook(() => useTheme(), { wrapper });

			act(() => {
				result.current.setTheme("dark");
			});

			expect(result.current.theme).toBe("dark");
			expect(localStorage.getItem("theme")).toBe("dark");
			expect(document.documentElement.classList.contains("dark")).toBe(true);
		});

		it("should update theme to light", () => {
			const { result } = renderHook(() => useTheme(), { wrapper });

			act(() => {
				result.current.setTheme("light");
			});

			expect(result.current.theme).toBe("light");
			expect(localStorage.getItem("theme")).toBe("light");
			expect(document.documentElement.classList.contains("light")).toBe(true);
		});

		it("should remove localStorage when set to system", () => {
			localStorage.setItem("theme", "dark");
			const { result } = renderHook(() => useTheme(), { wrapper });

			act(() => {
				result.current.setTheme("system");
			});

			expect(result.current.theme).toBe("system");
			expect(localStorage.getItem("theme")).toBeNull();
		});
	});

	describe("system preference changes", () => {
		it("should react to system preference changes in system mode", () => {
			renderHook(() => useTheme(), { wrapper });

			act(() => {
				matchMediaMock.trigger(true);
			});

			expect(document.documentElement.classList.contains("dark")).toBe(true);

			act(() => {
				matchMediaMock.trigger(false);
			});

			expect(document.documentElement.classList.contains("light")).toBe(true);
		});

		it("should not react to system changes when theme is explicit", () => {
			localStorage.setItem("theme", "dark");
			renderHook(() => useTheme(), { wrapper });

			act(() => {
				matchMediaMock.trigger(false);
			});

			// Should stay dark since explicit theme overrides system
			expect(document.documentElement.classList.contains("dark")).toBe(true);
		});
	});

	describe("cleanup", () => {
		it("should remove media listener on unmount", () => {
			const { unmount } = renderHook(() => useTheme(), { wrapper });
			unmount();
			expect(matchMediaMock.mql.removeEventListener).toHaveBeenCalled();
		});
	});

	describe("useTheme outside provider", () => {
		it("should throw when used outside ThemeProvider", () => {
			// React 19 use() throws when context value is the default sentinel
			expect(() => {
				renderHook(() => useTheme());
			}).toThrow();
		});
	});

	describe("rendering", () => {
		it("should render children", () => {
			render(
				<ThemeProvider>
					<div data-testid="child">Hello</div>
				</ThemeProvider>,
			);
			expect(screen.getByTestId("child")).toBeInTheDocument();
		});
	});
});
