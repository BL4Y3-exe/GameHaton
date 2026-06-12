import { useState } from 'react';
import { Gamepad2 } from 'lucide-react';

export default function GameImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`grid place-items-center bg-gradient-to-br from-panel to-night text-slate-500 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Gamepad2 className="h-12 w-12" />
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
