"use client";

import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/lib/types";

const PLACEHOLDER_USER: User = {
  id: "",
  name: "Guest",
  email: "",
  role: "student",
  campus: "PTC Campus",
};

/** @deprecated Prefer useAuth() for session-aware user state. */
export function useCurrentUser() {
  const auth = useAuth();

  return {
    currentUser: auth.currentUser ?? PLACEHOLDER_USER,
    users: auth.currentUser ? [auth.currentUser] : [],
    switchRole: () => {
      /* Role switching removed — use real login per role */
    },
    role: auth.role,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
  };
}
