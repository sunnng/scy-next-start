"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Component() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");

		try {
			const res = await authClient.forgetPassword({
				email,
				redirectTo: "/reset-password",
			});
			setIsSubmitted(true);
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitted) {
		return (
			<main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
				<Card className="w-[350px]">
					<CardHeader>
						<CardTitle>Check your email</CardTitle>
						<CardDescription>We've sent a password reset link to your email.</CardDescription>
					</CardHeader>
					<CardContent>
						<Alert variant="default">
							<CheckCircle2 className="h-4 w-4" />
							<AlertDescription>If you don't see the email, check your spam folder.</AlertDescription>
						</Alert>
					</CardContent>
					<CardFooter>
						<Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to reset password
						</Button>
					</CardFooter>
				</Card>
			</main>
		);
	}

	return (
		<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
			<div className="flex flex-col items-center gap-2">
				<h1 className="font-bold text-2xl">忘记密码</h1>
				<p className="text-balance text-muted-foreground text-sm">Enter your email to reset your password</p>
			</div>
			<div className="grid w-full items-center gap-4">
				<div className="flex flex-col space-y-1.5">
					<Input
						id="email"
						type="email"
						placeholder="Enter your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
			</div>
			{error && (
				<Alert variant="destructive" className="mt-4">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<Button className="mt-4 w-full" type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Sending..." : "Send reset link"}
			</Button>

			<Link href="/sign-in">
				<Button variant="link" className="cursor-pointer px-0">
					返回登录页面
				</Button>
			</Link>
		</form>
	);
}
