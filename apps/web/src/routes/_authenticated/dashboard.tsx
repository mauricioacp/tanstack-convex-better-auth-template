import { api } from "@acme/backend/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
	CheckCircle2Icon,
	DollarSignIcon,
	FileIcon,
	FolderIcon,
	ListTodoIcon,
	PlusIcon,
	SettingsIcon,
	UsersIcon,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/_authenticated/dashboard")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(convexQuery(api.privateData.get, {}));
	},
	head: () => seo({ title: m.seo_dashboard(), path: "/dashboard" }),
	component: DashboardPage,
});

type StatsCardProps = {
	title: string;
	value: string;
	change: string;
	icon: LucideIcon;
};

function StatsCard({ title, value, change, icon: Icon }: StatsCardProps) {
	const isPositive = change.startsWith("+");

	return (
		<Card size="sm">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardDescription>{title}</CardDescription>
					<Icon className="size-4 text-muted-foreground" />
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex items-baseline justify-between">
					<p className="font-bold text-2xl tracking-tight">{value}</p>
					<span
						className={cn(
							"font-medium text-xs",
							isPositive ? "text-green-600" : "text-red-600",
						)}
					>
						{change}
					</span>
				</div>
			</CardContent>
		</Card>
	);
}

type ActivityItemProps = {
	icon: LucideIcon;
	text: string;
	time: string;
};

function ActivityItem({ icon: Icon, text, time }: ActivityItemProps) {
	return (
		<div className="flex items-start gap-3">
			<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
				<Icon className="size-4 text-muted-foreground" />
			</div>
			<div className="flex-1">
				<p className="text-sm">{text}</p>
				<p className="text-muted-foreground text-xs">{time}</p>
			</div>
		</div>
	);
}

export function DashboardPage() {
	useSuspenseQuery(convexQuery(api.privateData.get, {}));

	return (
		<div className="space-y-6">
			{/* Welcome Card */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">
						{m.dashboard_welcome_title()}
					</CardTitle>
					<CardDescription>{m.dashboard_welcome_description()}</CardDescription>
				</CardHeader>
			</Card>

			{/* Stats Grid */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title={m.dashboard_stat_users()}
					value="1,234"
					change="+12%"
					icon={UsersIcon}
				/>
				<StatsCard
					title={m.dashboard_stat_revenue()}
					value="$12,345"
					change="+8%"
					icon={DollarSignIcon}
				/>
				<StatsCard
					title={m.dashboard_stat_projects()}
					value="42"
					change="+3"
					icon={FolderIcon}
				/>
				<StatsCard
					title={m.dashboard_stat_tasks()}
					value="156"
					change="-5"
					icon={ListTodoIcon}
				/>
			</div>

			{/* Two-column layout */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Quick Actions */}
				<Card>
					<CardHeader>
						<CardTitle>{m.dashboard_quick_actions()}</CardTitle>
						<CardDescription>
							{m.dashboard_quick_actions_description()}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<Link
							to="/dashboard"
							className={buttonVariants({
								variant: "outline",
								className: "w-full justify-start gap-2",
							})}
						>
							<PlusIcon className="size-4" />
							{m.dashboard_action_new_project()}
						</Link>
						<Link
							to="/settings"
							className={buttonVariants({
								variant: "outline",
								className: "w-full justify-start gap-2",
							})}
						>
							<UsersIcon className="size-4" />
							{m.dashboard_action_invite_team()}
						</Link>
						<Link
							to="/settings"
							className={buttonVariants({
								variant: "outline",
								className: "w-full justify-start gap-2",
							})}
						>
							<SettingsIcon className="size-4" />
							{m.dashboard_action_settings()}
						</Link>
					</CardContent>
				</Card>

				{/* Recent Activity */}
				<Card>
					<CardHeader>
						<CardTitle>{m.dashboard_recent_activity()}</CardTitle>
						<CardDescription>
							{m.dashboard_recent_activity_description()}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<ActivityItem
								icon={FileIcon}
								text={m.dashboard_activity_1()}
								time="2h ago"
							/>
							<ActivityItem
								icon={UsersIcon}
								text={m.dashboard_activity_2()}
								time="5h ago"
							/>
							<ActivityItem
								icon={CheckCircle2Icon}
								text={m.dashboard_activity_3()}
								time="1d ago"
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
