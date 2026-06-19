import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";

type Project = {
  id: string;
  projectName: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
};

type ProjectsResponse = {
  projects: Project[];
};

async function fetchProjects() {
  const res = await fetch("/api/projects", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load projects");
  }
  return (await res.json()) as ProjectsResponse;
}

export default async function ProjectsPage() {
  const data = await fetchProjects();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
              <p className="mt-1 text-sm text-slate-600">Create and manage your active work.</p>
            </div>
            <a
              href="/projects/new"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              New Project
            </a>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.projects.length ? (
              data.projects.map((project: Project) => (
                <ProjectCard key={project.id} {...project} />
              ))
            ) : (
              <p className="text-sm text-slate-600">You have no projects yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
