import { ExternalLink } from 'lucide-react';
import { formatDate, formatHours } from '../../utils/formatters.js';
import Button from '../common/Button.jsx';
import GameImage from '../common/GameImage.jsx';

export default function GameCard({ game }) {
  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.05]">
      <GameImage
        className="aspect-[460/215] w-full object-cover"
        src={game.image}
        alt={game.name}
      />
      <div className="p-4">
        <h3 className="line-clamp-1 text-lg font-black text-white">{game.name}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {(game.tags || game.genres || []).slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-md bg-white/10 px-2 py-1 text-xs font-bold text-slate-300">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-500">Playtime</p>
            <p className="font-bold text-white">{formatHours(game.playtimeHours)}</p>
          </div>
          <div>
            <p className="text-slate-500">Last played</p>
            <p className="font-bold text-white">{formatDate(game.lastPlayedAt)}</p>
          </div>
        </div>
        <Button as="a" href={game.storeUrl} target="_blank" rel="noreferrer" variant="secondary" className="mt-4 w-full">
          <ExternalLink className="h-4 w-4" />
          Store
        </Button>
      </div>
    </article>
  );
}
