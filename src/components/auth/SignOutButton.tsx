"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/shared/Button";
import { useAuth } from "@/hooks/useAuth";

export function SignOutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      router.replace("/login");
    } catch {
      setIsSigningOut(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleSignOut}
      disabled={isSigningOut}
      aria-label="Sign out"
      className="shrink-0"
    >
      {isSigningOut ? "Signing out…" : "Sign out"}
    </Button>
  );
}
