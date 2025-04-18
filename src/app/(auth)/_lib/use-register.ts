import { signUp } from "@/lib/auth-client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { convertImageToBase64 } from "./utils";

type SignUpResponse = {
  token: string | null;
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

type SignUpFormRequest = {
  email: string;
  password: string;
  name: string;
  image?: File | undefined;
};

export function useRegister() {
  const router = useRouter();

  const mutation = useMutation<SignUpResponse, Error, SignUpFormRequest>({
    mutationFn: async (json) => {
      const { name, email, password, image } = json;

      const { data, error } = await signUp.email({
        email,
        password,
        name,
        image: image ? await convertImageToBase64(image) : "",
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("注册成功");
      router.push("/");
    },
    onError: (error) => {
      toast.error(`注册失败：${error.message}`);
    },
  });

  return mutation;
}
