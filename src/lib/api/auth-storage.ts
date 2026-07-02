/**
 * MVP token storage in localStorage.
 * TODO: Migrate to httpOnly secure cookies when the backend supports Set-Cookie auth.
 */

const ACCESS_TOKEN_KEY = "ptc_access_token";
const REFRESH_TOKEN_KEY = "ptc_refresh_token";
const ACCESS_EXPIRES_KEY = "ptc_access_expires_at";
const SESSION_COOKIE = "ptc-has-session";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getAccessExpiresAt(): number | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(ACCESS_EXPIRES_KEY);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function setTokens(accessToken: string, refreshToken: string, expiresInSeconds: number): void {
  if (!isBrowser()) return;
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  window.localStorage.setItem(ACCESS_EXPIRES_KEY, String(expiresAt));
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 14}; SameSite=Lax${secure}`;
}

export function clearTokens(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(ACCESS_EXPIRES_KEY);
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

export function hasStoredSession(): boolean {
  if (!isBrowser()) return false;
  return Boolean(getAccessToken() && getRefreshToken());
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}
