import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

let mockUser: { name: string; email: string } | undefined;
const mockSignOut = vi.fn();
const mockNavigate = vi.fn();

vi.mock("convex/react", () => ({
	useQuery: () => mockUser,
}));

vi.mock("@acme/backend/convex/_generated/api", () => ({
	api: {
		auth: {
			getCurrentUser: "auth:getCurrentUser",
		},
	},
}));

vi.mock("@/lib/auth-client", () => ({
	authClient: {
		signOut: (...args: unknown[]) => mockSignOut(...args),
	},
}));

vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => mockNavigate,
}));

import UserMenu from "../user-menu";

describe("UserMenu", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUser = { name: "John Doe", email: "john@example.com" };
	});

	it("should render user name in trigger button", () => {
		render(<UserMenu />);
		expect(
			screen.getByRole("button", { name: "John Doe" }),
		).toBeInTheDocument();
	});

	it("should render user email in dropdown when opened", async () => {
		const user = userEvent.setup();
		render(<UserMenu />);

		await user.click(screen.getByRole("button", { name: "John Doe" }));

		await waitFor(() => {
			expect(screen.getByText("john@example.com")).toBeInTheDocument();
		});
	});

	it("should render My Account label in dropdown when opened", async () => {
		const user = userEvent.setup();
		render(<UserMenu />);

		await user.click(screen.getByRole("button", { name: "John Doe" }));

		await waitFor(() => {
			expect(screen.getByText("My Account")).toBeInTheDocument();
		});
	});

	it("should call authClient.signOut when Sign Out is clicked", async () => {
		const user = userEvent.setup();
		render(<UserMenu />);

		await user.click(screen.getByRole("button", { name: "John Doe" }));

		await waitFor(() => {
			expect(screen.getByText("Sign Out")).toBeInTheDocument();
		});

		await user.click(screen.getByText("Sign Out"));

		expect(mockSignOut).toHaveBeenCalledWith(
			expect.objectContaining({
				fetchOptions: expect.objectContaining({
					onSuccess: expect.any(Function),
				}),
			}),
		);
	});

	it("should render empty trigger when user data is loading", () => {
		mockUser = undefined;
		render(<UserMenu />);
		const button = screen.getByRole("button");
		expect(button.textContent).toBe("");
	});
});
