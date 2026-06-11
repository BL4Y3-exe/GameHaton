export default function EmptyState({ title = 'Nothing here yet', message = 'Try syncing your library or changing filters.' }) {
  return (
    <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{message}</p>
    </div>
  );
}
