type SeoOptions = {
	title?: string;
	description?: string;
	image?: string;
	path?: string;
};

export function seo({ title, description, image, path }: SeoOptions) {
	const fullTitle = title ? `${title} | Acme` : "Acme";
	return {
		meta: [
			{ title: fullTitle },
			{ property: "og:title", content: fullTitle },
			...(description
				? [
						{ name: "description", content: description },
						{ property: "og:description", content: description },
					]
				: []),
			...(image ? [{ property: "og:image", content: image }] : []),
		],
		links: path
			? [
					{ rel: "alternate", hrefLang: "en", href: path },
					{ rel: "alternate", hrefLang: "es", href: `/es${path}` },
					{ rel: "alternate", hrefLang: "x-default", href: path },
				]
			: [],
	};
}
