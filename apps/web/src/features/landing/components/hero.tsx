import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, GithubIcon } from "lucide-react";

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

			{/* Glow effect behind heading */}
			<div
				aria-hidden
				className="pointer-events-none absolute top-1/4 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
			/>

			<div className="relative z-10 mx-auto max-w-3xl text-center">
				{/* Badge */}
				<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-muted-foreground text-xs">
					<span className="inline-block size-1.5 rounded-full bg-primary" />
					Open Source Template
				</div>

				{/* Title with gradient */}
				<h1 className="mb-6 font-extrabold text-4xl leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
					<span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
						{m.landing_hero_title()}
					</span>
				</h1>

				<p className="mx-auto mb-10 max-w-xl text-muted-foreground text-sm leading-relaxed md:text-base">
					{m.landing_hero_subtitle()}
				</p>

				{/* CTA buttons */}
				<div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
					<Link
						to="/sign-up"
						className={buttonVariants({
							size: "lg",
							className: "gap-2 px-5",
						})}
					>
						{m.landing_hero_cta_primary()}
						<ArrowRightIcon className="size-3.5" />
					</Link>
					<a
						href="https://github.com"
						target="_blank"
						rel="noopener noreferrer"
						className={buttonVariants({
							variant: "outline",
							size: "lg",
							className: "gap-2 px-5",
						})}
					>
						<GithubIcon className="size-3.5" />
						{m.landing_hero_cta_secondary()}
					</a>
				</div>
			</div>
		</section>
	);
}
