import { Link, useRouteContext } from "@tanstack/react-router";

import UserMenu from "@/features/auth/components/user-menu";
import * as m from "@/paraglide/messages";

import LocaleSwitcher from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { buttonVariants } from "./ui/button";

export default function Header() {
	const { isAuthenticated } = useRouteContext({ from: "__root__" });

	return (
		<div>
			<div className="flex flex-row items-center justify-between px-2 py-1">
				<nav className="flex gap-4 text-lg">
					<Link to="/">{m.home()}</Link>
					{isAuthenticated && <Link to="/dashboard">{m.dashboard()}</Link>}
					{isAuthenticated && <Link to="/settings">{m.settings()}</Link>}
				</nav>
				<div className="flex items-center gap-2">
					<LocaleSwitcher />
					<ThemeToggle />
					{isAuthenticated ? (
						<UserMenu />
					) : (
						<>
							<Link
								to="/sign-in"
								className={buttonVariants({ variant: "ghost", size: "sm" })}
							>
								{m.sign_in()}
							</Link>
							<Link to="/sign-up" className={buttonVariants({ size: "sm" })}>
								{m.sign_up()}
							</Link>
						</>
					)}
				</div>
			</div>
			<hr />
		</div>
	);
}
