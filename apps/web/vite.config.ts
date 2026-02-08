import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import alchemy from "alchemy/cloudflare/tanstack-start";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const require = createRequire(import.meta.url);
const pkg = require("./package.json") as { version: string };

function getGitCommit(): string {
	try {
		return execFileSync("git", ["rev-parse", "--short", "HEAD"])
			.toString()
			.trim();
	} catch {
		return "dev";
	}
}

export default defineConfig({
	plugins: [
		paraglideVitePlugin({
			project: "./project.inlang",
			outdir: "./src/paraglide",
			emitTsDeclarations: true,
			strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
			urlPatterns: [
				{
					pattern: "/:path(.*)?",
					localized: [
						["es", "/es/:path(.*)?"],
						["en", "/:path(.*)?"],
					],
				},
			],
			disableAsyncLocalStorage: true,
		}),
		tsconfigPaths(),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		existsSync(".alchemy/local/wrangler.jsonc") && alchemy(),
	],
	define: {
		__BUILD_COMMIT__: JSON.stringify(getGitCommit()),
		__BUILD_TIME__: JSON.stringify(new Date().toISOString()),
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	server: {
		port: 3001,
	},
	ssr: {
		noExternal: ["@convex-dev/better-auth"],
	},
});
