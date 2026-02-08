import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import * as m from "@/paraglide/messages";

import { ChangePasswordForm } from "./change-password-form";
import { ProfileForm } from "./profile-form";

type SettingsPageProps = {
	currentName: string;
};

export function SettingsPage({ currentName }: SettingsPageProps) {
	return (
		<div className="container mx-auto max-w-2xl space-y-6 p-4">
			<h1 className="font-bold text-2xl">{m.settings()}</h1>

			<Card>
				<CardHeader>
					<CardTitle>{m.profile()}</CardTitle>
					<CardDescription>{m.update_profile()}</CardDescription>
				</CardHeader>
				<CardContent>
					<ProfileForm currentName={currentName} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>{m.change_password()}</CardTitle>
					<CardDescription>{m.change_password_description()}</CardDescription>
				</CardHeader>
				<CardContent>
					<ChangePasswordForm />
				</CardContent>
			</Card>
		</div>
	);
}
