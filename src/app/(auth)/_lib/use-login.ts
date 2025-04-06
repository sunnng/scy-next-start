import { signIn } from "@/lib/auth-client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { SignInFormData } from "./schemas";

type SignInResponse = {
  redirect: boolean;
  token: string;
  url: string | undefined;
  user: {
    id: string;
    email: string;
    name: string;
    image: string | null | undefined;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

export function useLogin() {
  const router = useRouter();

  const mutation = useMutation<SignInResponse, Error, SignInFormData>({
    mutationFn: async (req) => {
      const { email, password, rememberMe } = req;

      const { data, error } = await signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("登录成功");
      router.push("/");
    },
    onError: (error) => {
      toast.error(`登录失败：${error.message}`);
    },
  });

  return mutation;
}
