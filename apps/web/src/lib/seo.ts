type SeoOptions = {
	title?: string;
	description?: string;
	image?: string;
};

export function seo({ title, description, image }: SeoOptions) {
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
	};
}
