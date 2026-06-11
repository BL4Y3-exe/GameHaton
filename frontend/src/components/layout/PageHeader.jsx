export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-slate-400">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
