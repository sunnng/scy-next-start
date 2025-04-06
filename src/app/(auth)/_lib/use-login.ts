import { signIn } from "@/lib/auth-client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

type SignInFormRequest = {
  email: string;
  password: string;
};

export function useLogin() {
  const router = useRouter();

  const mutation = useMutation<SignInResponse, Error, SignInFormRequest>({
    mutationFn: async (req) => {
      const { email, password } = req;

      const { data, error } = await signIn.email({
        email,
        password,
        rememberMe: false,
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
