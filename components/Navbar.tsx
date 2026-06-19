"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div>
        <a href="/dashboard" className="text-lg font-semibold text-slate-900">
          Project Manager
        </a>
      </div>
      <div className="flex items-center gap-3">
        <a href="/projects" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Projects
        </a>
        <a href="/tasks" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Tasks
        </a>
        <button
          type="button"
          onClick={logout}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
