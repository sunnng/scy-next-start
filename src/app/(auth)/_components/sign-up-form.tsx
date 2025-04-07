"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { type SignUpFormData, signUpSchema } from "../_lib/schemas";
import { useRegister } from "../_lib/use-register";

export function SignUpForm() {
	const [_image, setImage] = useState<File | null>(null);
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
		<Form {...form}>
			<form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="font-bold text-2xl">注册账号</h1>
					<p className="text-balance text-muted-foreground text-sm">请填写以下信息以创建您的账号</p>
				</div>

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
											<Image src={imagePreview} alt="Profile preview" fill sizes="80px" className="object-cover" />
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
												className="h-5 w-5 cursor-pointer text-foreground hover:text-foreground/80"
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
					{isPending && <Loader2 className="animate-spin" />}
					注册
				</Button>

				<div className="text-center text-sm">
					已有账号 ?{" "}
					<Link href="/sign-in" className="underline underline-offset-4">
						点击登录
					</Link>
				</div>
			</form>
		</Form>
	);
}
