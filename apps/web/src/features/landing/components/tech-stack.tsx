import { cn } from "@/lib/utils";
import * as m from "@/paraglide/messages";

const techStack = [
	{
		name: "React 19",
		description: "UI Library",
		color: "bg-[#61dafb]/10 text-[#61dafb]",
	},
	{
		name: "TanStack Start",
		description: "SSR Framework",
		color: "bg-orange-500/10 text-orange-500",
	},
	{
		name: "Convex",
		description: "Backend Platform",
		color: "bg-primary/10 text-primary",
	},
	{
		name: "Better Auth",
		description: "Authentication",
		color: "bg-green-500/10 text-green-500",
	},
	{
		name: "Tailwind CSS v4",
		description: "Styling",
		color: "bg-cyan-500/10 text-cyan-500",
	},
	{
		name: "TypeScript",
		description: "Language",
		color: "bg-blue-600/10 text-blue-600",
	},
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
							className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-md motion-safe:hover:scale-105"
						>
							<div
								className={cn(
									"flex size-12 items-center justify-center rounded-full font-bold text-base",
									tech.color,
								)}
							>
								{tech.name.charAt(0)}
							</div>
							<span className="font-semibold text-sm">{tech.name}</span>
							<span className="text-muted-foreground text-xs">
								{tech.description}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
