"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { type SignUpFormData, signUpSchema } from "../_lib/schemas";
import { useRegister } from "../_lib/use-register";

export function SignUpForm() {
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { mutate: register, isPending } = useRegister();

	const form = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			image: undefined,
		},
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			form.setValue("image", file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	function onSubmit(values: SignUpFormData) {
		register({
			...values,
		});
	}

	return (
		<Card className="rounded-none pt-8">
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">注册账号</CardTitle>
				<CardDescription className="text-xs md:text-sm">请输入您的信息完成注册</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>用户名</FormLabel>
										<FormControl>
											<Input placeholder="用户名" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>邮箱</FormLabel>
										<FormControl>
											<Input placeholder="m@example.com" type="email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>密码</FormLabel>
										<FormControl>
											<Input type="password" placeholder="请输入密码" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>确认密码</FormLabel>
										<FormControl>
											<Input type="password" placeholder="请再次输入密码" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="image"
								render={({ field }) => (
									<FormItem>
										<FormLabel>头像（可选）</FormLabel>
										<FormControl>
											<div className="flex items-center gap-4">
												{imagePreview && (
													<div className="relative h-20 w-20 overflow-hidden rounded-lg">
														<Image
															src={imagePreview}
															alt="Profile preview"
															fill
															sizes="80px"
															className="object-cover"
														/>
													</div>
												)}
												<div className="flex flex-1 items-center gap-2">
													<Input
														className="flex-1 cursor-pointer"
														type="file"
														accept="image/*"
														name={field.name}
														onBlur={field.onBlur}
														ref={(e) => {
															field.ref(e);
															fileInputRef.current = e;
														}}
														onChange={handleImageChange}
													/>
													{imagePreview && (
														<X
															className="h-5 w-5 cursor-pointer text-neutral-500 hover:text-neutral-700"
															onClick={() => {
																setImage(null);
																setImagePreview(null);
																form.setValue("image", undefined);
																if (fileInputRef.current) {
																	fileInputRef.current.value = "";
																}
															}}
														/>
													)}
												</div>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={isPending}>
								注册
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>

			<CardFooter>
				<div className="flex w-full justify-center border-t pt-4">
					<div className="text-center text-neutral-700 text-sm">
						已有账号 ?{" "}
						<Link href="/sign-in" className="underline underline-offset-4">
							点击登录
						</Link>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
