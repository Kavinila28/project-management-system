type ProjectCardProps = {
  id: string;
  projectName: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
};

export default function ProjectCard({ projectName, description, status, startDate, endDate }: ProjectCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">{projectName}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
          {status.replaceAll("_", " ")}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
        <span>Start: {new Date(startDate).toLocaleDateString()}</span>
        <span>End: {new Date(endDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
