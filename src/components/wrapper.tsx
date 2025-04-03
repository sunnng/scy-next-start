"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function Wrapper(props: { children: React.ReactNode }) {
	return (
		<div className="relative flex min-h-screen w-full justify-center bg-grid-small-black/[0.2] bg-white dark:bg-black dark:bg-grid-small-white/[0.2]">
			<div className="absolute z-50 flex w-full items-center justify-between border-border border-b bg-white px-4 py-2 md:px-1 lg:w-8/12 dark:bg-black">
				<Link href="/">
					<div className="flex cursor-pointer items-center gap-2">
						<Logo />
						<p className="text-black dark:text-white">Sun Start.</p>
					</div>
				</Link>
				<div className="z-50 flex items-center">
					<ThemeToggle />
				</div>
			</div>
			<div className="mt-20 w-full lg:w-7/12">{props.children}</div>
		</div>
	);
}

const queryClient = new QueryClient();

export function WrapperWithQuery(props: { children: React.ReactNode }) {
	return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}
