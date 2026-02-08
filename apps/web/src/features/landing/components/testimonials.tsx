import { QuoteIcon } from "lucide-react";

import * as m from "@/paraglide/messages";

const testimonials = [
	{
		quote: () => m.landing_testimonial_1_quote(),
		name: () => m.landing_testimonial_1_name(),
		title: () => m.landing_testimonial_1_title(),
	},
	{
		quote: () => m.landing_testimonial_2_quote(),
		name: () => m.landing_testimonial_2_name(),
		title: () => m.landing_testimonial_2_title(),
	},
	{
		quote: () => m.landing_testimonial_3_quote(),
		name: () => m.landing_testimonial_3_name(),
		title: () => m.landing_testimonial_3_title(),
	},
];

export function Testimonials() {
	return (
		<section className="px-4 py-24">
			<div className="mx-auto max-w-5xl">
				<div className="mb-14 text-center">
					<h2 className="mb-3 font-bold text-3xl tracking-tight">
						{m.landing_testimonials_title()}
					</h2>
					<p className="text-muted-foreground text-sm">
						{m.landing_testimonials_subtitle()}
					</p>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{testimonials.map((testimonial) => (
						<div
							key={testimonial.name()}
							className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
						>
							<QuoteIcon className="size-5 text-primary/40" />
							<p className="flex-1 text-muted-foreground text-xs italic leading-relaxed">
								&ldquo;{testimonial.quote()}&rdquo;
							</p>
							<div className="border-border border-t pt-4">
								<p className="font-semibold text-xs">{testimonial.name()}</p>
								<p className="text-[10px] text-muted-foreground">
									{testimonial.title()}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
