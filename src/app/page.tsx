import Link from "next/link";

const DASHBOARDS = [
  {
    label: "Student wallet",
    href: "/student/wallet",
    desc: "Earn & spend PTC Credits",
    icon: "M4 5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4Zm10 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  },
  {
    label: "Staff rewards",
    href: "/staff/rewards",
    desc: "Issue credits to students",
    icon: "M10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM3 16a7 7 0 0 1 14 0 1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z",
  },
  {
    label: "Vendor scanner",
    href: "/vendor/scanner",
    desc: "Scan & redeem rewards",
    icon: "M3 4a1 1 0 0 1 1-1h3v2H5v2H3V4Zm10-1h3a1 1 0 0 1 1 1v3h-2V5h-2V3ZM3 13h2v2h2v2H4a1 1 0 0 1-1-1v-3Zm14 0v3a1 1 0 0 1-1 1h-3v-2h2v-2h2ZM7 7h6v6H7V7Z",
  },
  {
    label: "Admin dashboard",
    href: "/admin",
    desc: "Oversee the program",
    icon: "M10 2 3 5v5c0 3.9 2.7 7.4 7 8 4.3-.6 7-4.1 7-8V5l-7-3Zm-.9 11.5L5.6 10l1.3-1.3 2.2 2.2 4-4L14.4 8l-5.3 5.5Z",
  },
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-app-gradient p-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lift backdrop-blur-xl sm:p-10 animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700 ring-1 ring-inset ring-sky-600/15">
            <span className="h-2 w-2 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500" aria-hidden />
            PTC Campus Rewards
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            School rewards, <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">reimagined</span>
          </h1>
          <p className="mt-3 max-w-xl text-slate-600">
            Campus PTC Credits for students, staff issuing, vendor redemptions, and admin
            oversight — all in one modern wallet.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-sky-500 to-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-brand transition-all hover:to-sky-700 active:scale-[0.99] sm:flex-none sm:px-8"
            >
              Sign in
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M10.6 4.4a1 1 0 0 0-1.4 1.4L12.2 9H4a1 1 0 1 0 0 2h8.2l-3 3.2a1 1 0 1 0 1.4 1.4l4.8-4.9a1 1 0 0 0 0-1.4l-4.8-4.9Z" />
              </svg>
            </Link>
          </div>

          <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Jump to a workspace
          </p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {DASHBOARDS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="card-hover flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-soft"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-brand">
                    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden>
                      <path d={item.icon} />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
                    <span className="block text-xs text-slate-500">{item.desc}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
