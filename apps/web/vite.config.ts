import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
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
		tsconfigPaths(),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		alchemy(),
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
