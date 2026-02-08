import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRouterMock } from "@/test/mocks/router";
import { createSonnerMock } from "@/test/mocks/sonner";

const mockUpdateUser = vi.fn();

vi.mock("@/lib/auth-client", () => ({
	authClient: {
		updateUser: (...args: unknown[]) => mockUpdateUser(...args),
	},
}));

vi.mock("@tanstack/react-router", () => createRouterMock());
vi.mock("sonner", () => createSonnerMock());

import { toast } from "sonner";

import { ProfileForm } from "../components/profile-form";

describe("ProfileForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render display name input with current name", () => {
		render(<ProfileForm currentName="John Doe" />);
		const input = screen.getByLabelText(/display name/i);
		expect(input).toBeInTheDocument();
		expect(input).toHaveValue("John Doe");
	});

	it("should render save button", () => {
		render(<ProfileForm currentName="John Doe" />);
		expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
	});

	it("should show validation error when name is too short", async () => {
		render(<ProfileForm currentName="John Doe" />);
		const input = screen.getByLabelText(/display name/i);

		await userEvent.clear(input);
		await userEvent.type(input, "J");

		await userEvent.click(screen.getByRole("button", { name: /save/i }));

		await waitFor(() => {
			expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
		});
	});

	it("should call updateUser on successful submit", async () => {
		mockUpdateUser.mockResolvedValue({ data: {} });
		render(<ProfileForm currentName="John Doe" />);
		const input = screen.getByLabelText(/display name/i);

		await userEvent.clear(input);
		await userEvent.type(input, "Jane Doe");
		await userEvent.click(screen.getByRole("button", { name: /save/i }));

		await waitFor(() => {
			expect(mockUpdateUser).toHaveBeenCalledWith({ name: "Jane Doe" });
		});
	});

	it("should show success toast after update", async () => {
		mockUpdateUser.mockResolvedValue({ data: {} });
		render(<ProfileForm currentName="John Doe" />);
		const input = screen.getByLabelText(/display name/i);

		await userEvent.clear(input);
		await userEvent.type(input, "Jane Doe");
		await userEvent.click(screen.getByRole("button", { name: /save/i }));

		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(
				"Profile updated successfully",
			);
		});
	});

	it("should show error toast on API failure", async () => {
		mockUpdateUser.mockResolvedValue({
			error: { message: "Update failed" },
		});
		render(<ProfileForm currentName="John Doe" />);
		const input = screen.getByLabelText(/display name/i);

		await userEvent.clear(input);
		await userEvent.type(input, "Jane Doe");
		await userEvent.click(screen.getByRole("button", { name: /save/i }));

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith("Update failed");
		});
	});
});
