import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
	useRouteContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";

import { Toaster } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";
import { getToken } from "@/lib/auth-server";
import { seo } from "@/lib/seo";
import { ThemeProvider } from "@/lib/theme-provider";
import { getLocale } from "@/paraglide/runtime.js";

import Header from "../components/header";
import appCss from "../index.css?url";

const getAuth = createServerFn({ method: "GET" }).handler(async () => {
	return await getToken();
});

export type RouterAppContext = {
	queryClient: QueryClient;
	convexQueryClient: ConvexQueryClient;
};

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			...seo({}).meta,
		],
		links: [{ rel: "stylesheet", href: appCss }],
		scripts: [
			{
				children: `(function(){try{var t=localStorage.getItem("theme");var d=window.matchMedia("(prefers-color-scheme:dark)").matches;var c=t==="light"||t==="dark"?t:d?"dark":"light";document.documentElement.classList.add(c)}catch(e){}})()`,
			},
		],
	}),

	component: RootDocument,
	beforeLoad: async (ctx) => {
		const token = await getAuth();
		if (token) {
			ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
		}
		return {
			isAuthenticated: !!token,
			token,
		};
	},
});

function RootDocument() {
	const context = useRouteContext({ from: Route.id });
	return (
		<ConvexBetterAuthProvider
			client={context.convexQueryClient.convexClient}
			authClient={authClient}
			initialToken={context.token}
		>
			<ThemeProvider>
				<html lang={getLocale()}>
					<head>
						<HeadContent />
					</head>
					<body>
						<div className="grid h-svh grid-rows-[auto_1fr]">
							<Header />
							<div className={context.isAuthenticated ? "" : "pt-20"}>
								<Outlet />
							</div>
						</div>
						<Toaster richColors />
						<TanStackRouterDevtools position="bottom-left" />
						<Scripts />
					</body>
				</html>
			</ThemeProvider>
		</ConvexBetterAuthProvider>
	);
}
