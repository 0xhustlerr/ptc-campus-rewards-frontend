"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as authApi from "@/lib/api/auth";
import { clearTokens, hasStoredSession } from "@/lib/api/auth-storage";
import { ApiError, getUserFacingErrorMessage } from "@/lib/api/errors";
import { mapUser } from "@/lib/api/mappers";
import type { User as ApiUser } from "@/lib/api/types";
import type { User, UserRole } from "@/lib/types";

type AuthContextValue = {
  currentUser: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserRole>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toUiUser(apiUser: ApiUser): User {
  return mapUser(apiUser);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!hasStoredSession()) {
      setCurrentUser(null);
      return;
    }
    try {
      const me = await authApi.getCurrentUser();
      setCurrentUser(toUiUser(me));
    } catch (err) {
      setCurrentUser(null);
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        clearTokens();
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void loadUser().finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [loadUser]);

  useEffect(() => {
    const onExpired = () => {
      clearTokens();
      setCurrentUser(null);
    };
    window.addEventListener("ptc-auth-expired", onExpired);
    return () => window.removeEventListener("ptc-auth-expired", onExpired);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await authApi.login({ email, password });
    const me = await authApi.getCurrentUser();
    const user = toUiUser(me);
    setCurrentUser(user);
    return user.role;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setCurrentUser(null);
  }, []);

  const refreshSession = useCallback(async () => {
    await authApi.refreshSession();
    await loadUser();
  }, [loadUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      role: currentUser?.role ?? null,
      isAuthenticated: Boolean(currentUser),
      isLoading,
      login,
      logout,
      refreshSession,
    }),
    [currentUser, isLoading, login, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
}

export function getLoginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.body?.detail && error.body.detail !== "Internal server error") {
      return error.body.detail;
    }
    if (error.code && error.code !== "unauthorized") {
      return getUserFacingErrorMessage(error, "Unable to sign in. Check your email and password.");
    }
  }
  return getUserFacingErrorMessage(error, "Unable to sign in. Check your email and password.");
}
