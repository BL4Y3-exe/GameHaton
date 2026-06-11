export default function ErrorState({ message = 'Something went wrong.' }) {
  return (
    <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-5 text-sm text-rose-100">
      {message}
    </div>
  );
}
