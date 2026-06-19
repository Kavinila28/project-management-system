type TaskCardProps = {
  taskName: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
};

export default function TaskCard({ taskName, description, status, priority, dueDate }: TaskCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-slate-900">{taskName}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
          {priority}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
        <span>Status: {status.replaceAll("_", " ")}</span>
        <span>Due: {new Date(dueDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
