import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { type Theme, useTheme } from "@/lib/theme-provider";

import { Button } from "./ui/button";

const THEME_CYCLE: Record<Theme, Theme> = {
	system: "light",
	light: "dark",
	dark: "system",
};

const THEME_ICON: Record<Theme, typeof SunIcon> = {
	light: SunIcon,
	dark: MoonIcon,
	system: MonitorIcon,
};

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const Icon = THEME_ICON[theme];

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			aria-label="Toggle theme"
			onClick={() => setTheme(THEME_CYCLE[theme])}
		>
			<Icon className="size-4" />
		</Button>
	);
}
