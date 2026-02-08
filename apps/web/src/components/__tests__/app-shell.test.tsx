import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell } from "../app-shell";

describe("AppShell", () => {
	it("should render children in main area", () => {
		render(
			<AppShell>
				<p>Main content</p>
			</AppShell>,
		);
		expect(screen.getByText("Main content")).toBeInTheDocument();
		expect(screen.getByRole("main")).toBeInTheDocument();
	});

	it("should not render sidebar when not provided", () => {
		render(
			<AppShell>
				<p>Content</p>
			</AppShell>,
		);
		expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
	});

	it("should render sidebar when provided", () => {
		render(
			<AppShell sidebar={<nav>Sidebar nav</nav>}>
				<p>Content</p>
			</AppShell>,
		);
		expect(screen.getByRole("complementary")).toBeInTheDocument();
		expect(screen.getByText("Sidebar nav")).toBeInTheDocument();
	});
});
