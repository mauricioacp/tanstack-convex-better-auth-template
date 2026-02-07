import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_auth")({
	beforeLoad: ({ context }) => {
		if (context.isAuthenticated) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<div className="flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<Outlet />
			</div>
		</div>
	);
}
