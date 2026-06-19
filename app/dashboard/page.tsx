import Navbar from "@/components/Navbar";

async function fetchDashboard() {
  const res = await fetch("/api/dashboard", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load dashboard");
  }
  return res.json();
}

export default async function DashboardPage() {
  const data = await fetchDashboard();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Projects", value: data.totalProjects },
              { label: "Tasks", value: data.totalTasks },
              { label: "Completed Tasks", value: data.completedTasks },
              { label: "Pending Tasks", value: data.pendingTasks },
              { label: "Projects In Progress", value: data.projectsInProgress },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
