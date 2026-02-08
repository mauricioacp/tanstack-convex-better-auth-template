import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createSonnerMock } from "@/test/mocks/sonner";

const mockSubmitContact = vi.fn();

vi.mock("convex/react", () => ({
	useMutation: () => mockSubmitContact,
}));
vi.mock("sonner", () => createSonnerMock());
vi.mock("@/hooks/use-countdown", () => ({
	useCountdown: () => ({ secondsLeft: null, start: vi.fn() }),
}));
vi.mock("@/lib/rate-limit", () => ({
	parseAuthError: () => ({ isRateLimited: false, retryAfter: 0 }),
}));
vi.mock("@acme/backend/convex/_generated/api", () => ({
	api: { contactForm: { submit: "contactForm:submit" } },
}));
vi.mock("@/paraglide/messages", () => ({
	landing_contact_title: () => "Contact Us",
	landing_contact_subtitle: () => "Get in touch",
	landing_contact_name: () => "Name",
	landing_contact_email: () => "Email",
	landing_contact_message: () => "Message",
	landing_contact_message_placeholder: () => "Your message...",
	landing_contact_message_min: () => "At least 10 characters",
	landing_contact_send: () => "Send",
	landing_contact_success: () => "Message sent!",
	something_went_wrong: () => "Something went wrong",
	too_many_attempts: ({ seconds }: { seconds: string }) =>
		`Too many attempts. Retry in ${seconds}s`,
}));

import { ContactForm } from "../components/contact-form";

describe("ContactForm", () => {
	it("should render the form with all fields", () => {
		render(<ContactForm />);
		expect(screen.getByText("Contact Us")).toBeInTheDocument();
		expect(screen.getByText("Get in touch")).toBeInTheDocument();
		expect(screen.getByLabelText("Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Message")).toBeInTheDocument();
	});

	it("should render the submit button", () => {
		render(<ContactForm />);
		expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
	});

	it("should have the contact section id", () => {
		const { container } = render(<ContactForm />);
		expect(container.querySelector("#contact")).toBeInTheDocument();
	});

	it("should call submitContact on valid submission", async () => {
		const user = userEvent.setup();
		mockSubmitContact.mockResolvedValueOnce(undefined);
		render(<ContactForm />);

		await user.type(screen.getByLabelText("Name"), "John Doe");
		await user.type(screen.getByLabelText("Email"), "john@example.com");
		await user.type(
			screen.getByLabelText("Message"),
			"Hello, this is a test message!",
		);
		await user.click(screen.getByRole("button", { name: "Send" }));

		await waitFor(() => {
			expect(mockSubmitContact).toHaveBeenCalledWith({
				name: "John Doe",
				email: "john@example.com",
				message: "Hello, this is a test message!",
			});
		});
	});

	it("should show success state after submission", async () => {
		const user = userEvent.setup();
		mockSubmitContact.mockResolvedValueOnce(undefined);
		render(<ContactForm />);

		await user.type(screen.getByLabelText("Name"), "John Doe");
		await user.type(screen.getByLabelText("Email"), "john@example.com");
		await user.type(
			screen.getByLabelText("Message"),
			"Hello, this is a test message!",
		);
		await user.click(screen.getByRole("button", { name: "Send" }));

		expect(await screen.findByText("Message sent!")).toBeInTheDocument();
	});
});
