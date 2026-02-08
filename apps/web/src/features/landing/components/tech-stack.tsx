import * as m from "@/paraglide/messages";

const techStack = [
	{ name: "React 19", description: "UI Library" },
	{ name: "TanStack Start", description: "SSR Framework" },
	{ name: "Convex", description: "Backend Platform" },
	{ name: "Better Auth", description: "Authentication" },
	{ name: "Tailwind CSS v4", description: "Styling" },
	{ name: "TypeScript", description: "Language" },
];

export function TechStack() {
	return (
		<section className="border-border border-y px-4 py-24">
			<div className="mx-auto max-w-5xl">
				<div className="mb-14 text-center">
					<h2 className="mb-3 font-bold text-3xl tracking-tight">
						{m.landing_tech_title()}
					</h2>
					<p className="text-muted-foreground text-sm">
						{m.landing_tech_subtitle()}
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
					{techStack.map((tech) => (
						<div
							key={tech.name}
							className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-center transition-colors hover:border-primary/40 hover:bg-muted/40"
						>
							{/* Monogram circle */}
							<div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
								{tech.name.charAt(0)}
							</div>
							<span className="font-medium text-xs">{tech.name}</span>
							<span className="text-[10px] text-muted-foreground">
								{tech.description}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
