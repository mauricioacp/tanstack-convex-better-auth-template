import { Link } from "@tanstack/react-router";

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
					<CardTitle>Page not found</CardTitle>
					<CardDescription>
						The page you're looking for doesn't exist or has been moved.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Link to="/" className={buttonVariants()}>
						Go Home
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
