import { Cookie } from "lucide-react";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { ModeToggle } from "@/components/layouts/mode-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 w-full border-border border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
			<div className="container flex h-14 items-center">
				<Link href="/" className="mr-2 flex items-center md:mr-6 md:space-x-2">
					<div
						className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
						aria-hidden="true"
					>
						<Cookie className="size-4" />
					</div>
					<span className="hidden text-nowrap font-bold md:inline-block">{siteConfig.name}</span>
				</Link>

				<nav className="flex w-full items-center gap-6 text-sm">
					<Link
						href="https://diceui.com/docs/components/data-table"
						target="_blank"
						rel="noopener noreferrer"
						className="text-foreground/60 transition-colors hover:text-foreground"
					>
						Guild
					</Link>
				</nav>

				<nav className="flex flex-1 items-center gap-2 md:justify-end">
					<Button variant="ghost" size="icon" className="size-8" asChild>
						<Link aria-label="GitHub repo" href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
							<Icons.gitHub className="size-4" aria-hidden="true" />
						</Link>
					</Button>
					<ModeToggle />
				</nav>
			</div>
		</header>
	);
}
