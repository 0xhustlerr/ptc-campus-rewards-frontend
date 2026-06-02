import { apiGet, apiPost } from "@/lib/api/client";
import { clearTokens, setTokens } from "@/lib/api/auth-storage";
import type { SelfRegisterRequest, TokenResponse, User } from "@/lib/api/types";

export type LoginCredentials = {
  email: string;
  password: string;
};

export async function login(credentials: LoginCredentials): Promise<TokenResponse> {
  const data = await apiPost<TokenResponse>("/auth/login", credentials, { skipAuth: true });
  setTokens(data.access_token, data.refresh_token, data.expires_in);
  return data;
}

export async function refreshSession(): Promise<TokenResponse> {
  const { getRefreshToken } = await import("@/lib/api/auth-storage");
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }
  const data = await apiPost<TokenResponse>(
    "/auth/refresh",
    { refresh_token: refreshToken },
    { skipAuth: true },
  );
  setTokens(data.access_token, data.refresh_token, data.expires_in);
  return data;
}

export async function logout(): Promise<void> {
  const { getRefreshToken } = await import("@/lib/api/auth-storage");
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await apiPost("/auth/logout", { refresh_token: refreshToken });
    }
  } finally {
    clearTokens();
  }
}

export async function getCurrentUser(): Promise<User> {
  return apiGet<User>("/auth/me");
}

export async function register(body: SelfRegisterRequest): Promise<User> {
  return apiPost<User>("/auth/register", body, { skipAuth: true });
}
