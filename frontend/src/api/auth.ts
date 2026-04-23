import type { AuthResponse, LoginPayload } from "../types";
import { api } from "./client";

export const authApi = {
  login: (data: LoginPayload) => api.post<AuthResponse>("/auth/login", data),
  me: () => api.get<AuthResponse>("/auth/me"),
};
