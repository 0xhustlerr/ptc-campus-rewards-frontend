"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";

import { AlertBanner } from "@/components/shared/AlertBanner";
import { Button } from "@/components/shared/Button";
import { LoadingState } from "@/components/shared/FeedbackStates";
import { FormField, Input } from "@/components/shared/FormField";
import { getLoginErrorMessage, useAuth } from "@/hooks/useAuth";
import { getSafeRedirectPath } from "@/lib/role-helpers";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { login, isLoading: authLoading, isAuthenticated, role } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated && role) {
      router.replace(getSafeRedirectPath(role, next));
    }
  }, [authLoading, isAuthenticated, role, next, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const userRole = await login(email.trim(), password);
      router.replace(getSafeRedirectPath(userRole, next));
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
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
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">PTC Campus Rewards</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Sign in</h1>
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
