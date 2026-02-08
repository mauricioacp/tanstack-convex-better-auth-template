import { vi } from "vitest";

export const mockNavigate = vi.fn();

export function createRouterMock(
	contextOverrides: Record<string, unknown> = {},
) {
	return {
		useNavigate: () => mockNavigate,
		useRouteContext: () => ({
			isAuthenticated: false,
			...contextOverrides,
		}),
		Link: ({
			to,
			children,
			...props
		}: {
			to: string;
			children: React.ReactNode;
			[key: string]: unknown;
		}) => (
			<a href={to} {...props}>
				{children}
			</a>
		),
		redirect: vi.fn(),
	};
}
