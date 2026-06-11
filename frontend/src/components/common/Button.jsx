import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-mint text-night hover:bg-emerald-300',
  secondary: 'bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15',
  ghost: 'text-slate-300 hover:bg-white/10 hover:text-white',
  danger: 'bg-rose-500 text-white hover:bg-rose-400',
};

export default function Button({
  children,
  className = '',
  variant = 'primary',
  loading = false,
  as: Component = 'button',
  ...props
}) {
  return (
    <Component
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </Component>
  );
}
