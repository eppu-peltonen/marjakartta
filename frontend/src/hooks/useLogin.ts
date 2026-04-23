import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import type { LoginPayload } from "../types";
import { useAuth } from "./useAuth";
import { router } from "../routes/router";

export function useLogin() {
  const { login } = useAuth();
  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (response) => {
      login(response.user, response.token);
      router.navigate({ to: "/" });
    },
  });
}
