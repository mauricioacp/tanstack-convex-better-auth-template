import { useForm } from "@tanstack/react-form";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import z from "zod";

import { FormField } from "../ui/form-field";

function TestForm({ children }: { children?: React.ReactNode }) {
	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
		onSubmit: async () => {},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<FormField form={form} name="email" label="Email" type="email" />
			<FormField form={form} name="password" label="Password" type="password">
				{children}
			</FormField>
			<button type="submit">Submit</button>
		</form>
	);
}

describe("FormField", () => {
	it("should render a label with the correct text", () => {
		render(<TestForm />);
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
	});

	it("should render an input with the correct type", () => {
		render(<TestForm />);
		expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
		expect(screen.getByLabelText("Password")).toHaveAttribute(
			"type",
			"password",
		);
	});

	it("should display validation errors on submit", async () => {
		const user = userEvent.setup();
		render(<TestForm />);

		await user.click(screen.getByRole("button", { name: "Submit" }));

		await waitFor(() => {
			expect(screen.getByText("Invalid email address")).toBeInTheDocument();
		});
	});

	it("should use text-destructive class for error messages", async () => {
		const user = userEvent.setup();
		render(<TestForm />);

		await user.click(screen.getByRole("button", { name: "Submit" }));

		await waitFor(() => {
			const errorMsg = screen.getByText("Invalid email address");
			expect(errorMsg).toHaveClass("text-destructive");
		});
	});

	it("should render children next to the label", () => {
		render(
			<TestForm>
				<span data-testid="extra-child">Forgot?</span>
			</TestForm>,
		);
		expect(screen.getByTestId("extra-child")).toBeInTheDocument();
	});

	it("should accept a placeholder prop", () => {
		const form = createTestFormWithPlaceholder();
		render(form);
		expect(screen.getByPlaceholderText("Enter code")).toBeInTheDocument();
	});
});

function createTestFormWithPlaceholder() {
	function Inner() {
		const form = useForm({
			defaultValues: { code: "" },
			onSubmit: async () => {},
		});
		return (
			<FormField
				form={form}
				name="code"
				label="Code"
				placeholder="Enter code"
				inputMode="numeric"
			/>
		);
	}
	return <Inner />;
}
