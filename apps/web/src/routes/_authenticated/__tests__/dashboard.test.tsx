import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createRouterMock } from "@/test/mocks/router";

vi.mock("@tanstack/react-router", () => ({
	...createRouterMock({ isAuthenticated: true }),
	createFileRoute: () => () => ({ component: null }),
}));

vi.mock("@convex-dev/react-query", () => ({
	convexQuery: () => ({ queryKey: ["test"], queryFn: vi.fn() }),
}));

vi.mock("@tanstack/react-query", () => ({
	useSuspenseQuery: () => ({ data: { message: "test data" } }),
}));

vi.mock("@acme/backend/convex/_generated/api", () => ({
	api: { privateData: { get: "privateData.get" } },
}));

vi.mock("@/paraglide/messages", () => ({
	dashboard_welcome_title: () => "Welcome Back",
	dashboard_welcome_description: () => "Here's what's happening",
	dashboard_stat_users: () => "Total Users",
	dashboard_stat_revenue: () => "Revenue",
	dashboard_stat_projects: () => "Projects",
	dashboard_stat_tasks: () => "Tasks",
	dashboard_quick_actions: () => "Quick Actions",
	dashboard_quick_actions_description: () => "Common tasks",
	dashboard_action_new_project: () => "Create New Project",
	dashboard_action_invite_team: () => "Invite Team Members",
	dashboard_action_settings: () => "Manage Settings",
	dashboard_recent_activity: () => "Recent Activity",
	dashboard_recent_activity_description: () => "Your latest updates",
	dashboard_activity_1: () => "Created project",
	dashboard_activity_2: () => "Invited members",
	dashboard_activity_3: () => "Completed tasks",
	seo_dashboard: () => "Dashboard",
	dashboard: () => "Dashboard",
}));

// We need to import the component directly, not the route
// The RouteComponent is the default export from the route file
// But since it's wrapped in createFileRoute, we test the component function directly
import { DashboardPage } from "../dashboard";

describe("DashboardPage", () => {
	it("should render welcome card with title and description", () => {
		render(<DashboardPage />);
		expect(screen.getByText("Welcome Back")).toBeInTheDocument();
		expect(screen.getByText("Here's what's happening")).toBeInTheDocument();
	});

	it("should render 4 stat cards", () => {
		render(<DashboardPage />);
		expect(screen.getByText("Total Users")).toBeInTheDocument();
		expect(screen.getByText("Revenue")).toBeInTheDocument();
		expect(screen.getByText("Projects")).toBeInTheDocument();
		expect(screen.getByText("Tasks")).toBeInTheDocument();
	});

	it("should render stat values", () => {
		render(<DashboardPage />);
		expect(screen.getByText("1,234")).toBeInTheDocument();
		expect(screen.getByText("$12,345")).toBeInTheDocument();
		expect(screen.getByText("42")).toBeInTheDocument();
		expect(screen.getByText("156")).toBeInTheDocument();
	});

	it("should show green color for positive changes", () => {
		render(<DashboardPage />);
		const positiveChange = screen.getByText("+12%");
		expect(positiveChange.className).toContain("text-green");
	});

	it("should show red color for negative changes", () => {
		render(<DashboardPage />);
		const negativeChange = screen.getByText("-5");
		expect(negativeChange.className).toContain("text-red");
	});

	it("should render quick actions", () => {
		render(<DashboardPage />);
		expect(screen.getByText("Quick Actions")).toBeInTheDocument();
		expect(screen.getByText("Create New Project")).toBeInTheDocument();
		expect(screen.getByText("Invite Team Members")).toBeInTheDocument();
		expect(screen.getByText("Manage Settings")).toBeInTheDocument();
	});

	it("should wire settings action to /settings", () => {
		render(<DashboardPage />);
		const settingsLink = screen.getByRole("link", {
			name: /Manage Settings/,
		});
		expect(settingsLink).toHaveAttribute("href", "/settings");
	});

	it("should render recent activity", () => {
		render(<DashboardPage />);
		expect(screen.getByText("Recent Activity")).toBeInTheDocument();
		expect(screen.getByText("Created project")).toBeInTheDocument();
		expect(screen.getByText("Invited members")).toBeInTheDocument();
		expect(screen.getByText("Completed tasks")).toBeInTheDocument();
	});
});
