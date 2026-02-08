import { Link } from "@tanstack/react-router";

import * as m from "@/paraglide/messages";

import { Button, buttonVariants } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

type ErrorBoundaryProps = {
	error: Error;
	reset: () => void;
};

export function ErrorBoundary({ reset }: ErrorBoundaryProps) {
	return (
		<div className="flex min-h-[50vh] items-center justify-center">
			<Card className="w-full max-w-md text-center">
				<CardHeader>
					<CardTitle>{m.something_went_wrong()}</CardTitle>
					<CardDescription>{m.error_description()}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex justify-center gap-2">
						<Button onClick={reset}>{m.try_again()}</Button>
						<Link to="/" className={buttonVariants({ variant: "outline" })}>
							{m.error_go_home()}
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
