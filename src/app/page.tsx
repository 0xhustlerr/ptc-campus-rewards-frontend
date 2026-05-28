import Link from "next/link";

const DASHBOARDS = [
  { label: "Student wallet", href: "/student/wallet" },
  { label: "Staff rewards", href: "/staff/rewards" },
  { label: "Vendor scanner", href: "/vendor/scanner" },
  { label: "Admin dashboard", href: "/admin" },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">PTC Campus Rewards</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">School rewards wallet</h1>
        <p className="mt-3 text-slate-600">
          Campus PTC Credits for students, staff issuing, vendor redemptions, and admin oversight.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="flex flex-1 items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Sign in
          </Link>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {DASHBOARDS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
