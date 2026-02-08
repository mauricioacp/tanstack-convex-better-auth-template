import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		environment: "jsdom",
		setupFiles: ["./src/test/setup.ts"],
		globals: true,
		coverage: {
			provider: "v8",
			thresholds: { lines: 80, branches: 80, functions: 80 },
			include: ["src/**"],
			exclude: ["src/routeTree.gen.ts", "src/test/**"],
		},
	},
});
