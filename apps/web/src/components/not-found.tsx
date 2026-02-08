import { Link } from "@tanstack/react-router";

import * as m from "@/paraglide/messages";

import { buttonVariants } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

export default function NotFound() {
	return (
		<div className="flex min-h-[50vh] items-center justify-center">
			<Card className="w-full max-w-md text-center">
				<CardHeader>
					<CardTitle>{m.page_not_found()}</CardTitle>
					<CardDescription>{m.page_not_found_description()}</CardDescription>
				</CardHeader>
				<CardContent>
					<Link to="/" className={buttonVariants()}>
						{m.go_home()}
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
