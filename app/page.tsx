import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-900">Project Management System</h1>
        <p className="mt-4 text-lg text-slate-600">
          Plan your work with projects and tasks, then track completion across a dashboard.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link
            href="/login"
            className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-4 text-center text-lg font-semibold text-white transition hover:bg-slate-700"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-3xl border border-slate-200 bg-white px-6 py-4 text-center text-lg font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
