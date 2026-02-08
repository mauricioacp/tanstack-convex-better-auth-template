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
	const location = {
		pathname: "/",
		search: {},
		searchStr: "",
		hash: "",
		href: undefined,
		...options.location,
	};
	if (!location.href) {
		const search =
			location.searchStr ??
			(typeof location.search === "string" ? location.search : "");
		location.href = `${location.pathname}${search}${location.hash}`;
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
			select: (state: { location: typeof location }) => unknown;
		}) => select({ location }),
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
