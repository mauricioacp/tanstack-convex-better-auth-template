import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRouterMock } from "@/test/mocks/router";
import { createSonnerMock } from "@/test/mocks/sonner";

vi.mock("@/lib/auth-client", () => ({
	authClient: {
		updateUser: vi.fn(),
		changePassword: vi.fn(),
	},
}));

vi.mock("@tanstack/react-router", () => createRouterMock());
vi.mock("sonner", () => createSonnerMock());

import { SettingsPage } from "../components/settings-page";

describe("SettingsPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render page title", () => {
		render(<SettingsPage currentName="John Doe" />);
		expect(
			screen.getByRole("heading", { name: /settings/i, level: 1 }),
		).toBeInTheDocument();
	});

	it("should render profile section", () => {
		render(<SettingsPage currentName="John Doe" />);
		expect(screen.getByText("Profile")).toBeInTheDocument();
		expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
	});

	it("should render change password section", () => {
		render(<SettingsPage currentName="John Doe" />);
		expect(screen.getByText("Change Password")).toBeInTheDocument();
		expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
	});

	it("should pass current name to profile form", () => {
		render(<SettingsPage currentName="John Doe" />);
		expect(screen.getByLabelText(/display name/i)).toHaveValue("John Doe");
	});
});
