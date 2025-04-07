"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<Button
			variant="ghost"
			size="icon"
			className="size-8 cursor-pointer"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
		>
			<SunIcon className="dark:-rotate-90 size-5 rotate-0 scale-100 transition-all dark:scale-0" />
			<MoonIcon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
