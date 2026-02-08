import { Link, useRouteContext, useRouterState } from "@tanstack/react-router";

import UserMenu from "@/features/auth/components/user-menu";
import { cn } from "@/lib/utils";
import * as m from "@/paraglide/messages";

import LocaleSwitcher from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { buttonVariants } from "./ui/button";

export default function Header() {
	const { isAuthenticated } = useRouteContext({ from: "__root__" });

	if (isAuthenticated) {
		return <AppHeader />;
	}

	return <LandingHeader />;
}

function LandingHeader() {
	return (
		<header className="fixed top-4 right-4 left-4 z-50">
			<div className="mx-auto max-w-6xl rounded-xl border border-border/40 bg-background/80 px-4 py-3 shadow-sm backdrop-blur-md">
				<nav className="flex items-center justify-between">
					<div className="flex items-center gap-8">
						<Link to="/" className="font-bold text-base tracking-tight">
							Acme
						</Link>
						<div className="hidden items-center gap-6 md:flex">
							<a
								href="#features"
								className="text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								{m.header_features()}
							</a>
							<a
								href="#pricing"
								className="text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								{m.header_pricing()}
							</a>
							<a
								href="#contact"
								className="text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								{m.header_contact()}
							</a>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<LocaleSwitcher />
						<ThemeToggle />
						<Link
							to="/sign-in"
							className={buttonVariants({ variant: "ghost", size: "sm" })}
						>
							{m.sign_in()}
						</Link>
						<Link to="/sign-up" className={buttonVariants({ size: "sm" })}>
							{m.sign_up()}
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
}

function AppHeader() {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	return (
		<header className="sticky top-0 z-40 border-border border-b bg-background">
			<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
				<div className="flex items-center gap-6">
					<Link to="/" className="font-bold text-base tracking-tight">
						Acme
					</Link>
					<nav className="flex items-center gap-1">
						<Link
							to="/dashboard"
							className={cn(
								"rounded-md px-3 py-1.5 text-sm transition-colors",
								pathname === "/dashboard"
									? "bg-muted text-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{m.dashboard()}
						</Link>
						<Link
							to="/settings"
							className={cn(
								"rounded-md px-3 py-1.5 text-sm transition-colors",
								pathname.startsWith("/settings")
									? "bg-muted text-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{m.settings()}
						</Link>
					</nav>
				</div>

				<div className="flex items-center gap-3">
					<LocaleSwitcher />
					<ThemeToggle />
					<UserMenu />
				</div>
			</div>
		</header>
	);
}
