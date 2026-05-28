/**
 * Reusable fetch wrapper for the FastAPI backend.
 * Attaches Bearer token, handles 401 refresh, returns typed JSON.
 */

import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/lib/api/auth-storage";
import { ApiError, parseErrorResponse } from "@/lib/api/errors";
import type { TokenResponse } from "@/lib/api/types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

export function isApiConfigured(): boolean {
  return API_BASE_URL.length > 0;
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Skip Authorization header (login, refresh). */
  skipAuth?: boolean;
  /** Do not attempt token refresh on 401. */
  skipRefresh?: boolean;
};

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken || !API_BASE_URL) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!response.ok) {
      clearTokens();
      return false;
    }
    const data = (await response.json()) as TokenResponse;
    setTokens(data.access_token, data.refresh_token, data.expires_in);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

function scheduleRefresh(refresh: () => Promise<boolean>): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(
      "API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL in .env.local.",
      0,
    );
  }

  const { body, skipAuth, skipRefresh, headers: initHeaders, ...init } = options;
  const headers = new Headers(initHeaders);
  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, {
    ...init,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && !skipAuth && !skipRefresh) {
    const refreshed = await scheduleRefresh(refreshAccessToken);
    if (refreshed) {
      return apiRequest<T>(path, { ...options, skipRefresh: true });
    }
    clearTokens();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ptc-auth-expired"));
    }
    throw await parseErrorResponse(response);
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function apiGet<T>(path: string, init?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...init, method: "GET" });
}

export async function apiPost<T>(path: string, body?: unknown, init?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...init, method: "POST", body });
}

export async function apiPatch<T>(path: string, body?: unknown, init?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...init, method: "PATCH", body });
}
