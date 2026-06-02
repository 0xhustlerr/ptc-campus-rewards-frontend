"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import { AlertBanner } from "@/components/shared/AlertBanner";
import { Button } from "@/components/shared/Button";
import { FormField, Input, Select } from "@/components/shared/FormField";
import { register } from "@/lib/api/auth";
import { getUserFacingErrorMessage } from "@/lib/api/errors";
import type { SelfRegisterRequest } from "@/lib/api/types";

const SELF_REGISTER_ROLES: Array<{ value: SelfRegisterRequest["role"]; label: string }> = [
  { value: "student", label: "Student" },
  { value: "staff", label: "Staff" },
  { value: "vendor", label: "Vendor" },
];

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<SelfRegisterRequest["role"]>("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const payload = useMemo<SelfRegisterRequest>(
    () => ({
      email: email.trim(),
      password,
      role,
      phone: phone.trim() ? phone.trim() : null,
    }),
    [email, password, phone, role],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      await register(payload);
      setSuccessMessage("Registration submitted. Your account will be active after admin approval.");
      setPassword("");
    } catch (err) {
      setError(getUserFacingErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">PTC Campus Rewards</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Register</h1>
        <p className="mt-2 text-sm text-slate-600">
          Select your role and credentials. An admin must approve your registration before login.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <FormField label="Role" htmlFor="role">
            <Select id="role" value={role} onChange={(e) => setRole(e.target.value as SelfRegisterRequest["role"])}>
              {SELF_REGISTER_ROLES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </FormField>

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

          <FormField label="Password" htmlFor="password" hint="At least 8 characters">
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>

          <FormField label="Phone (optional)" htmlFor="phone">
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 0100"
            />
          </FormField>

          {error && <AlertBanner variant="error" message={error} />}
          {successMessage && <AlertBanner variant="success" message={successMessage} />}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting…" : "Submit registration"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-sky-700 hover:text-sky-800">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
