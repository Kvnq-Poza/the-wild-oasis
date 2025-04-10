/* eslint-disable no-unused-vars */
import { useMutation } from "@tanstack/react-query";
import { signUp as signUpApi } from "./apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
  const { mutate: signUp, isLoading } = useMutation({
    mutationFn: (user) => signUpApi(user),
    onSuccess: (user) => {
      toast.success(
        "Account successfully created! Please verify the new account from the user's email address."
      );
    },
    onError: (err) => {
      console.log("ERROR", err);
    },
  });
  return { signUp, isLoading };
}
