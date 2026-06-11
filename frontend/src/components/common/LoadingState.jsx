import { Loader2 } from 'lucide-react';

export default function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300">
      <Loader2 className="mr-2 h-5 w-5 animate-spin text-mint" />
      {label}
    </div>
  );
}
