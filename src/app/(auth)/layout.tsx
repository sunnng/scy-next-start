import { Cookie } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="relative flex min-h-svh w-full items-center justify-center bg-[#f5f5f5] p-6 md:p-10">
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					backgroundImage: `
      linear-gradient(to right, #e4e4e7 1px, transparent 1px),
      linear-gradient(to bottom, #e4e4e7 1px, transparent 1px)
    `,
					backgroundSize: "8px 8px",
				}}
			/>
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background: "radial-gradient(circle at center, transparent 0%, #f5f5f5 90%)",
				}}
			/>

			<Link href="/" className="absolute top-6 left-6 flex items-center gap-2 font-medium md:top-10 md:left-10">
				<div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
					<Cookie className="size-4" />
				</div>
				帅斌饼干
			</Link>

			<div className="relative flex w-full max-w-sm flex-col gap-2 p-6 md:max-w-md">{children}</div>
		</div>
	);
}
