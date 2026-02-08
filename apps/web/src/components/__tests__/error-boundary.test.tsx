import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRouterMock } from "@/test/mocks/router";

vi.mock("@tanstack/react-router", () => createRouterMock());

import { ErrorBoundary } from "../error-boundary";

describe("ErrorBoundary", () => {
	const mockReset = vi.fn();
	const defaultError = new Error("Test error message");

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render a friendly error title", () => {
		render(<ErrorBoundary error={defaultError} reset={mockReset} />);
		expect(screen.getByText("Something went wrong")).toBeInTheDocument();
	});

	it("should render a user-friendly description", () => {
		render(<ErrorBoundary error={defaultError} reset={mockReset} />);
		expect(
			screen.getByText(/something unexpected happened/i),
		).toBeInTheDocument();
	});

	it("should render a Try Again button", () => {
		render(<ErrorBoundary error={defaultError} reset={mockReset} />);
		expect(
			screen.getByRole("button", { name: /try again/i }),
		).toBeInTheDocument();
	});

	it("should call reset when Try Again is clicked", async () => {
		render(<ErrorBoundary error={defaultError} reset={mockReset} />);
		await userEvent.click(screen.getByRole("button", { name: /try again/i }));
		expect(mockReset).toHaveBeenCalledOnce();
	});

	it("should render a Go Home link", () => {
		render(<ErrorBoundary error={defaultError} reset={mockReset} />);
		const link = screen.getByRole("link", { name: /go home/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/");
	});

	it("should not display the raw error message prominently", () => {
		render(<ErrorBoundary error={defaultError} reset={mockReset} />);
		// The card description should be the friendly message, not error.message
		const description = screen.getByText(/something unexpected happened/i);
		expect(description).toBeInTheDocument();
	});
});
