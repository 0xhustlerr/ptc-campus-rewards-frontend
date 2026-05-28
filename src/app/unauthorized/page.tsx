import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Access denied</h1>
      <p className="mt-2 text-sm text-slate-600">
        Your account does not have permission to view this page.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-block rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
      >
        Sign in with a different account
      </Link>
    </main>
  );
}
