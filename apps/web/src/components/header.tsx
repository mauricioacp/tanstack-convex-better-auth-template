import { Link, useRouteContext } from "@tanstack/react-router";

import UserMenu from "@/features/auth/components/user-menu";

import { buttonVariants } from "./ui/button";

export default function Header() {
	const { isAuthenticated } = useRouteContext({ from: "__root__" });

	return (
		<div>
			<div className="flex flex-row items-center justify-between px-2 py-1">
				<nav className="flex gap-4 text-lg">
					<Link to="/">Home</Link>
					{isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
				</nav>
				<div className="flex items-center gap-2">
					{isAuthenticated ? (
						<UserMenu />
					) : (
						<>
							<Link
								to="/sign-in"
								className={buttonVariants({ variant: "ghost", size: "sm" })}
							>
								Sign In
							</Link>
							<Link to="/sign-up" className={buttonVariants({ size: "sm" })}>
								Sign Up
							</Link>
						</>
					)}
				</div>
			</div>
			<hr />
		</div>
	);
}
