import { Link } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import * as m from "@/paraglide/messages";

const plans = [
	{
		title: () => m.landing_pricing_free_title(),
		price: () => m.landing_pricing_free_price(),
		description: () => m.landing_pricing_free_description(),
		features: [
			() => m.landing_pricing_free_f1(),
			() => m.landing_pricing_free_f2(),
			() => m.landing_pricing_free_f3(),
			() => m.landing_pricing_free_f4(),
		],
		cta: () => m.landing_pricing_free_cta(),
		href: "/sign-up",
		highlighted: false,
	},
	{
		title: () => m.landing_pricing_pro_title(),
		price: () => m.landing_pricing_pro_price(),
		period: () => m.landing_pricing_pro_period(),
		description: () => m.landing_pricing_pro_description(),
		features: [
			() => m.landing_pricing_pro_f1(),
			() => m.landing_pricing_pro_f2(),
			() => m.landing_pricing_pro_f3(),
			() => m.landing_pricing_pro_f4(),
		],
		cta: () => m.landing_pricing_pro_cta(),
		href: "/sign-up",
		highlighted: true,
	},
];

export function Pricing() {
	return (
		<section id="pricing" className="border-border border-y px-4 py-24">
			<div className="mx-auto max-w-3xl">
				<div className="mb-14 text-center">
					<h2 className="mb-3 font-bold text-3xl tracking-tight">
						{m.landing_pricing_title()}
					</h2>
					<p className="text-muted-foreground text-sm">
						{m.landing_pricing_subtitle()}
					</p>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{plans.map((plan) => (
						<div
							key={plan.title()}
							className={`flex flex-col rounded-xl border p-6 ${
								plan.highlighted
									? "border-primary bg-primary/5 ring-1 ring-primary/20"
									: "border-border bg-card"
							}`}
						>
							<div className="mb-6">
								<h3 className="mb-1 font-semibold text-sm">{plan.title()}</h3>
								<div className="flex items-baseline gap-1">
									<span className="font-bold text-3xl tracking-tight">
										{plan.price()}
									</span>
									{plan.period && (
										<span className="text-muted-foreground text-xs">
											{plan.period()}
										</span>
									)}
								</div>
								<p className="mt-2 text-muted-foreground text-xs">
									{plan.description()}
								</p>
							</div>

							<ul className="mb-6 flex-1 space-y-2">
								{plan.features.map((feature) => (
									<li
										key={feature()}
										className="flex items-center gap-2 text-xs"
									>
										<CheckIcon className="size-3.5 text-primary" />
										{feature()}
									</li>
								))}
							</ul>

							<Link
								to={plan.href}
								className={buttonVariants({
									variant: plan.highlighted ? "default" : "outline",
									className: "w-full",
								})}
							>
								{plan.cta()}
							</Link>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
