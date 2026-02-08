import { Link } from "@tanstack/react-router";

import * as m from "@/paraglide/messages";

const productLinks = [
	{ label: () => m.landing_footer_features(), href: "#features" },
	{ label: () => m.landing_footer_pricing(), href: "#pricing" },
	{ label: () => m.landing_footer_docs(), href: "/docs" },
];

const resourceLinks = [
	{
		key: "github",
		label: () => m.landing_footer_github(),
		href: "https://github.com",
		external: true,
	},
	{ key: "support", label: () => m.landing_footer_support(), href: "#contact" },
	{
		key: "changelog",
		label: () => m.landing_footer_changelog(),
		href: "https://github.com/releases",
		external: true,
	},
];

export function Footer() {
	return (
		<footer className="border-border border-t px-4 py-12">
			<div className="mx-auto max-w-5xl">
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
					{/* Brand */}
					<div>
						<Link to="/" className="font-bold text-sm tracking-tight">
							Acme
						</Link>
						<p className="mt-2 max-w-xs text-muted-foreground text-xs leading-relaxed">
							{m.landing_footer_description()}
						</p>
					</div>

					{/* Product links */}
					<div>
						<h4 className="mb-3 font-semibold text-xs">
							{m.landing_footer_product()}
						</h4>
						<ul className="space-y-2">
							{productLinks.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										className="text-muted-foreground text-xs transition-colors hover:text-foreground"
									>
										{link.label()}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Resource links */}
					<div>
						<h4 className="mb-3 font-semibold text-xs">
							{m.landing_footer_resources()}
						</h4>
						<ul className="space-y-2">
							{resourceLinks.map((link) => (
								<li key={link.key}>
									{link.external ? (
										<a
											href={link.href}
											target="_blank"
											rel="noopener noreferrer"
											className="text-muted-foreground text-xs transition-colors hover:text-foreground"
										>
											{link.label()}
										</a>
									) : (
										<a
											href={link.href}
											className="text-muted-foreground text-xs transition-colors hover:text-foreground"
										>
											{link.label()}
										</a>
									)}
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-10 border-border border-t pt-6 text-center text-[10px] text-muted-foreground">
					&copy; {new Date().getFullYear()} Acme. {m.landing_footer_rights()}
				</div>
			</div>
		</footer>
	);
}
