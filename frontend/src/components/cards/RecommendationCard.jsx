import { ExternalLink, Sparkles } from 'lucide-react';
import { formatDate, formatHours } from '../../utils/formatters.js';
import Button from '../common/Button.jsx';
import GameImage from '../common/GameImage.jsx';

export default function RecommendationCard({ item, featured = false }) {
  return (
    <article
      className={`overflow-hidden rounded-lg border bg-white/[0.05] ${
        featured ? 'border-mint/50 shadow-glow lg:grid lg:grid-cols-[1.05fr_1fr]' : 'border-white/10'
      }`}
    >
      <div className="relative bg-panel">
        <GameImage
          className="aspect-[460/215] h-full min-h-48 w-full object-cover"
          src={item.image}
          alt={item.name}
        />
        <div className="absolute left-4 top-4 rounded-lg bg-night/80 px-3 py-2 backdrop-blur">
          <p className="text-xs font-bold uppercase text-slate-400">Revival score</p>
          <p className="text-2xl font-black text-mint">{item.revivalScore}</p>
        </div>
      </div>
      <div className="p-5">
        {featured ? (
          <span className="inline-flex items-center gap-2 rounded-md bg-mint/15 px-3 py-1 text-xs font-black uppercase text-mint">
            <Sparkles className="h-3.5 w-3.5" />
            Top comeback pick
          </span>
        ) : null}
        <h3 className="mt-3 text-2xl font-black text-white">{item.name}</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-500">Playtime</p>
            <p className="font-bold text-white">{formatHours(item.playtimeHours)}</p>
          </div>
          <div>
            <p className="text-slate-500">Last played</p>
            <p className="font-bold text-white">{formatDate(item.lastPlayedAt)}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">{item.reason}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-white/10 px-2 py-1 text-xs font-bold text-slate-300">
              {tag}
            </span>
          ))}
        </div>
        <Button as="a" href={item.storeUrl} target="_blank" rel="noreferrer" className="mt-5">
          <ExternalLink className="h-4 w-4" />
          Open Steam
        </Button>
      </div>
    </article>
  );
}
