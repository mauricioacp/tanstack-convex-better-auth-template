import { useRouterState } from "@tanstack/react-router";
import { getLocale, locales, localizeHref } from "@/paraglide/runtime.js";

import { buttonVariants } from "./ui/button";

const localeLabels: Record<string, string> = {
	en: "EN",
	es: "ES",
};

export default function LocaleSwitcher() {
	const currentLocale = getLocale();
	const location = useRouterState({ select: (state) => state.location });
	const currentHref =
		location.href ||
		`${location.pathname}${location.searchStr ?? ""}${location.hash ?? ""}`;

	return (
		<div className="flex items-center gap-1">
			{locales.map((locale) => (
				<a
					key={locale}
					href={localizeHref(currentHref, { locale })}
					className={buttonVariants({
						variant: locale === currentLocale ? "default" : "ghost",
						size: "sm",
					})}
				>
					{localeLabels[locale] ?? locale}
				</a>
			))}
		</div>
	);
}
