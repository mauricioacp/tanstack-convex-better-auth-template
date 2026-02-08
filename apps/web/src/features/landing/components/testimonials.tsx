import { StarIcon } from "lucide-react";

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
							className="flex flex-col gap-5 rounded-xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
						>
							{/* Star rating */}
							<div className="flex gap-1">
								{Array.from({ length: 5 }).map((_, i) => (
									<StarIcon
										key={`star-${testimonial.name()}-${i}`}
										className="size-4 fill-primary text-primary"
									/>
								))}
							</div>

							{/* Quote */}
							<p className="flex-1 text-foreground text-sm italic leading-relaxed">
								&ldquo;{testimonial.quote()}&rdquo;
							</p>

							{/* Author with avatar */}
							<div className="flex items-center gap-3 border-border border-t pt-5">
								<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
									{testimonial
										.name()
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</div>
								<div>
									<p className="font-semibold text-sm">{testimonial.name()}</p>
									<p className="text-muted-foreground text-xs">
										{testimonial.title()}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
