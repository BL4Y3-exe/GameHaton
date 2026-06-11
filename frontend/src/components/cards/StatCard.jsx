export default function StatCard({ icon: Icon, label, value, tone = 'text-mint' }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-glow">
      <div className={`grid h-10 w-10 place-items-center rounded-lg bg-white/10 ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-5 text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}
