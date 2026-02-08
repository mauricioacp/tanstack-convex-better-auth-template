import { Link } from "@tanstack/react-router";
import { GithubIcon } from "lucide-react";

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
		<footer className="border-border border-t bg-muted/20 px-4 py-16">
			<div className="mx-auto max-w-6xl">
				<div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
					{/* Brand */}
					<div>
						<Link to="/" className="font-bold text-base tracking-tight">
							Acme
						</Link>
						<p className="mt-3 max-w-xs text-muted-foreground text-sm leading-relaxed">
							{m.landing_footer_description()}
						</p>
						{/* Social links */}
						<div className="mt-4 flex gap-3">
							<a
								href="https://github.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground transition-colors hover:text-foreground"
								aria-label="GitHub"
							>
								<GithubIcon className="size-5" />
							</a>
						</div>
					</div>

					{/* Product links */}
					<div>
						<h4 className="mb-3 font-semibold text-sm">
							{m.landing_footer_product()}
						</h4>
						<ul className="space-y-3">
							{productLinks.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									>
										{link.label()}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Resource links */}
					<div>
						<h4 className="mb-3 font-semibold text-sm">
							{m.landing_footer_resources()}
						</h4>
						<ul className="space-y-3">
							{resourceLinks.map((link) => (
								<li key={link.key}>
									{link.external ? (
										<a
											href={link.href}
											target="_blank"
											rel="noopener noreferrer"
											className="text-muted-foreground text-sm transition-colors hover:text-foreground"
										>
											{link.label()}
										</a>
									) : (
										<a
											href={link.href}
											className="text-muted-foreground text-sm transition-colors hover:text-foreground"
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
				<div className="mt-12 border-border border-t pt-8 text-center text-muted-foreground text-xs">
					&copy; {new Date().getFullYear()} Acme. {m.landing_footer_rights()}
				</div>
			</div>
		</footer>
	);
}
