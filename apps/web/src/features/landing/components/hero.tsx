import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, CheckIcon, GithubIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import * as m from "@/paraglide/messages";

export function Hero() {
	return (
		<section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4">
			{/* Subtle grid background */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black_40%,transparent_100%)]"
			/>

			{/* Animated floating gradient orb */}
			<div
				aria-hidden
				className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 animate-float rounded-full bg-primary/20 blur-[140px]"
			/>

			<div className="relative z-10 mx-auto max-w-3xl text-center">
				{/* Badge */}
				<div className="mb-10 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-muted-foreground text-sm">
					<span className="inline-block size-1.5 rounded-full bg-primary" />
					Open Source Template
				</div>

				{/* Title with gradient */}
				<h1 className="mb-6 font-extrabold text-5xl leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
					<span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
						{m.landing_hero_title()}
					</span>
				</h1>

				<p className="mx-auto mb-12 max-w-xl text-base text-muted-foreground leading-relaxed md:text-lg">
					{m.landing_hero_subtitle()}
				</p>

				{/* CTA buttons */}
				<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Link
						to="/sign-up"
						className={buttonVariants({
							size: "lg",
							className: "gap-2 px-6",
						})}
					>
						{m.landing_hero_cta_primary()}
						<ArrowRightIcon className="size-4" />
					</Link>
					<a
						href="https://github.com"
						target="_blank"
						rel="noopener noreferrer"
						className={buttonVariants({
							variant: "outline",
							size: "lg",
							className: "gap-2 px-6",
						})}
					>
						<GithubIcon className="size-4" />
						{m.landing_hero_cta_secondary()}
					</a>
				</div>

				{/* Trust indicators */}
				<div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm">
					<span className="flex items-center gap-2">
						<CheckIcon className="size-4 text-primary" />
						{m.landing_hero_trust_1()}
					</span>
					<span className="flex items-center gap-2">
						<CheckIcon className="size-4 text-primary" />
						{m.landing_hero_trust_2()}
					</span>
					<span className="flex items-center gap-2">
						<CheckIcon className="size-4 text-primary" />
						{m.landing_hero_trust_3()}
					</span>
				</div>
			</div>
		</section>
	);
}
