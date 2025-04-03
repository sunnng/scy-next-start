import { signUp } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
  username: string;
  image?: File | undefined;
};

export function useRegister() {
  const router = useRouter();

  const mutation = useMutation<SignUpResponse, Error, SignUpFormRequest>({
    mutationFn: async (json) => {
      const { username, email, password, image } = json;
      console.log(image);
      const { data, error } = await signUp.email({
        email,
        password,
        name: username,
        image: image ? await convertImageToBase64(image) : "",
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return mutation;
}
