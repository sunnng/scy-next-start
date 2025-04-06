import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { WrapperWithQuery } from "@/components/wrapper";

import { Nunito } from "next/font/google";
import { PT_Sans } from "next/font/google";

import "@/styles/globals.css";

import type { Metadata } from "next";

const nunito = Nunito({
	variable: "--font-nunito",
	subsets: ["latin"],
});

const ptSans = PT_Sans({
	variable: "--font-pt-sans",
	subsets: ["latin"],
	weight: ["400", "700"],
});

export const metadata: Metadata = {
	title: "Scy Next Start",
	description: "Generated by create-t3-app",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="zh" suppressHydrationWarning>
			<body className={`${nunito.variable} ${ptSans.variable} relative antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<WrapperWithQuery>
						<div className="texture" />
						{children}
						<Toaster />
					</WrapperWithQuery>
				</ThemeProvider>
			</body>
		</html>
	);
}
