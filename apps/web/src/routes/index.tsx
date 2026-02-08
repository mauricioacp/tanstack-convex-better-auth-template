import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/features/landing/components/contact-form";
import { FeaturesGrid } from "@/features/landing/components/features-grid";
import { Footer } from "@/features/landing/components/footer";
import { Hero } from "@/features/landing/components/hero";
import { Pricing } from "@/features/landing/components/pricing";
import { TechStack } from "@/features/landing/components/tech-stack";
import { Testimonials } from "@/features/landing/components/testimonials";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
	head: () =>
		seo({
			title: "Acme — Full-Stack Template",
			description:
				"Production-ready full-stack template with React 19, TanStack Start, Convex, and Better Auth.",
			path: "/",
		}),
	component: LandingPage,
});

function LandingPage() {
	return (
		<div className="min-h-screen">
			<Hero />
			<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
			<FeaturesGrid />
			<TechStack />
			<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
			<Testimonials />
			<Pricing />
			<ContactForm />
			<Footer />
		</div>
	);
}
