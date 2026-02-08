import { vi } from "vitest";

export const mockNavigate = vi.fn();

type RouterMockOptions = {
	location?: {
		pathname?: string;
		search?: unknown;
		searchStr?: string;
		hash?: string;
		href?: string;
	};
};

export function createRouterMock(
	contextOverrides: Record<string, unknown> = {},
	options: RouterMockOptions = {},
) {
	function getLocation() {
		const loc = {
			pathname: "/",
			search: {},
			searchStr: "",
			hash: "",
			href: undefined as string | undefined,
			...options.location,
		};
		if (!loc.href) {
			const search =
				loc.searchStr ?? (typeof loc.search === "string" ? loc.search : "");
			loc.href = `${loc.pathname}${search}${loc.hash}`;
		}
		return loc;
	}

	return {
		useNavigate: () => mockNavigate,
		useRouteContext: () => ({
			isAuthenticated: false,
			...contextOverrides,
		}),
		useRouterState: ({
			select,
		}: {
			select: (state: { location: ReturnType<typeof getLocation> }) => unknown;
		}) => select({ location: getLocation() }),
		Link: ({
			to,
			href,
			children,
			...props
		}: {
			to?: string;
			href?: string;
			children: React.ReactNode;
			[key: string]: unknown;
		}) => (
			<a href={href ?? to} {...props}>
				{children}
			</a>
		),
		redirect: vi.fn(),
	};
}
