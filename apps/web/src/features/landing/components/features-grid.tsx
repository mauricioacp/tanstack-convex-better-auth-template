import {
	CloudIcon,
	CodeIcon,
	GlobeIcon,
	LayersIcon,
	ShieldCheckIcon,
	TestTubesIcon,
	WorkflowIcon,
	ZapIcon,
} from "lucide-react";

import * as m from "@/paraglide/messages";

const features = [
	{
		icon: ShieldCheckIcon,
		title: () => m.landing_feature_auth_title(),
		description: () => m.landing_feature_auth_description(),
	},
	{
		icon: ZapIcon,
		title: () => m.landing_feature_realtime_title(),
		description: () => m.landing_feature_realtime_description(),
	},
	{
		icon: LayersIcon,
		title: () => m.landing_feature_ssr_title(),
		description: () => m.landing_feature_ssr_description(),
	},
	{
		icon: CodeIcon,
		title: () => m.landing_feature_typesafe_title(),
		description: () => m.landing_feature_typesafe_description(),
	},
	{
		icon: GlobeIcon,
		title: () => m.landing_feature_ui_title(),
		description: () => m.landing_feature_ui_description(),
	},
	{
		icon: TestTubesIcon,
		title: () => m.landing_feature_testing_title(),
		description: () => m.landing_feature_testing_description(),
	},
	{
		icon: WorkflowIcon,
		title: () => m.landing_feature_ci_title(),
		description: () => m.landing_feature_ci_description(),
	},
	{
		icon: CloudIcon,
		title: () => m.landing_feature_edge_title(),
		description: () => m.landing_feature_edge_description(),
	},
];

export function FeaturesGrid() {
	return (
		<section id="features" className="px-4 py-24">
			<div className="mx-auto max-w-5xl">
				<div className="mb-14 text-center">
					<h2 className="mb-3 font-bold text-3xl tracking-tight">
						{m.landing_features_title()}
					</h2>
					<p className="text-muted-foreground text-sm">
						{m.landing_features_subtitle()}
					</p>
				</div>

				<div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
					{features.map((feature) => (
						<div
							key={feature.title()}
							className="group flex flex-col gap-3 bg-card p-5 transition-colors hover:bg-muted/40"
						>
							<feature.icon className="size-5 text-primary" />
							<h3 className="font-semibold text-sm">{feature.title()}</h3>
							<p className="text-muted-foreground text-xs leading-relaxed">
								{feature.description()}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
