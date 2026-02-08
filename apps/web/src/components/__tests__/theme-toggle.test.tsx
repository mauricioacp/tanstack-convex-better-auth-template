import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Theme } from "@/lib/theme-provider";

let currentTheme: Theme = "system";
const mockSetTheme = vi.fn();

vi.mock("@/lib/theme-provider", () => ({
	useTheme: () => ({
		get theme() {
			return currentTheme;
		},
		setTheme: mockSetTheme,
	}),
}));

import { ThemeToggle } from "../theme-toggle";

describe("ThemeToggle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		currentTheme = "system";
	});

	it("should render a button with accessible label", () => {
		render(<ThemeToggle />);
		const button = screen.getByRole("button", { name: /toggle theme/i });
		expect(button).toBeInTheDocument();
	});

	it("should call setTheme with dark when current theme is light", async () => {
		currentTheme = "light";
		render(<ThemeToggle />);
		const button = screen.getByRole("button");
		await userEvent.click(button);
		expect(mockSetTheme).toHaveBeenCalledWith("dark");
	});

	it("should call setTheme with system when current theme is dark", async () => {
		currentTheme = "dark";
		render(<ThemeToggle />);
		const button = screen.getByRole("button");
		await userEvent.click(button);
		expect(mockSetTheme).toHaveBeenCalledWith("system");
	});

	it("should call setTheme with light when current theme is system", async () => {
		currentTheme = "system";
		render(<ThemeToggle />);
		const button = screen.getByRole("button");
		await userEvent.click(button);
		expect(mockSetTheme).toHaveBeenCalledWith("light");
	});
});
