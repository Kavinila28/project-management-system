import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";

type Task = {
  id: string;
  taskName: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
};

type TasksResponse = {
  tasks: Task[];
};

async function fetchTasks() {
  const res = await fetch("/api/tasks", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load tasks");
  }
  return (await res.json()) as TasksResponse;
}

export default async function TasksPage() {
  const data = await fetchTasks();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
              <p className="mt-1 text-sm text-slate-600">Track tasks across your projects.</p>
            </div>
            <a
              href="/tasks/new"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              New Task
            </a>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.tasks.length ? (
              data.tasks.map((task: Task) => (
                <TaskCard key={task.id} {...task} />
              ))
            ) : (
              <p className="text-sm text-slate-600">You have no tasks yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
