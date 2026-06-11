import { ExternalLink } from 'lucide-react';
import { formatPrice } from '../../utils/formatters.js';
import Button from '../common/Button.jsx';

export default function DealCard({ deal }) {
  return (
    <article className={`overflow-hidden rounded-lg border bg-white/[0.05] ${deal.isFree ? 'border-mint/40' : 'border-white/10'}`}>
      <div className="relative">
        <img className="aspect-[16/7] w-full object-cover" src={deal.image} alt={deal.name} />
        <span className={`absolute right-3 top-3 rounded-md px-2 py-1 text-xs font-black ${deal.isFree ? 'bg-mint text-night' : 'bg-ember text-night'}`}>
          {deal.isFree ? 'FREE' : `-${deal.discountPercent}%`}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{deal.source}</p>
        <h3 className="mt-2 line-clamp-1 text-lg font-black text-white">{deal.name}</h3>
        <div className="mt-4 flex items-end gap-3">
          <span className="text-2xl font-black text-mint">{formatPrice(deal.currentPrice)}</span>
          {deal.originalPrice > deal.currentPrice ? (
            <span className="pb-1 text-sm font-bold text-slate-500 line-through">{formatPrice(deal.originalPrice)}</span>
          ) : null}
        </div>
        <Button as="a" href={deal.storeUrl} target="_blank" rel="noreferrer" variant={deal.isFree ? 'primary' : 'secondary'} className="mt-4 w-full">
          <ExternalLink className="h-4 w-4" />
          View deal
        </Button>
      </div>
    </article>
  );
}
