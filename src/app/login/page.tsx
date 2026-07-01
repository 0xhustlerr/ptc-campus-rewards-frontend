"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";

import { AlertBanner } from "@/components/shared/AlertBanner";
import { Button } from "@/components/shared/Button";
import { LoadingState } from "@/components/shared/FeedbackStates";
import { FormField, Input } from "@/components/shared/FormField";
import { getLoginErrorMessage, useAuth } from "@/hooks/useAuth";
import { getSafeRedirectPath, navigateAfterAuth } from "@/lib/role-helpers";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { login, isLoading: authLoading, isAuthenticated, role } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated && role) {
      navigateAfterAuth(getSafeRedirectPath(role, next));
    }
  }, [authLoading, isAuthenticated, role, next]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      // Redirect runs in useEffect after auth state commits (avoids RouteGuard race).
    } catch (err) {
      setError(getLoginErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center p-6">
        <LoadingState message="Checking session…" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col justify-center bg-app-gradient p-6">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lift backdrop-blur-xl sm:p-8 animate-fade-up">
        <div className="mb-5 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-brand">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M10 2 3 5v5c0 3.9 2.7 7.4 7 8 4.3-.6 7-4.1 7-8V5l-7-3Z" />
            </svg>
          </span>
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">PTC Campus Rewards</p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">
          Use your campus account to access PTC Credits.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <FormField label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@ptc.edu"
            />
          </FormField>
          <FormField label="Password" htmlFor="password">
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>

          {error && <AlertBanner variant="error" message={error} />}

          <Button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="w-full"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Need an account?{" "}
          <Link href="/register" className="font-medium text-sky-700 hover:text-sky-800">
            Register
          </Link>
          {" · "}
          <Link href="/" className="font-medium text-sky-700 hover:text-sky-800">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="p-6 text-center text-sm text-slate-600">Loading…</p>}>
      <LoginForm />
    </Suspense>
  );
}
