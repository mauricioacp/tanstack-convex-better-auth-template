import type { ReactNode } from "react";

export function AppShell({
	sidebar,
	children,
}: {
	sidebar?: ReactNode;
	children: ReactNode;
}) {
	return (
		<div className="flex h-full">
			{sidebar && (
				<aside className="w-64 shrink-0 border-border border-r">
					{sidebar}
				</aside>
			)}
			<main className="flex-1 overflow-auto p-6">{children}</main>
		</div>
	);
}
