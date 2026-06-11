import { useEffect, useState } from 'react';
import PageHeader from '../components/layout/PageHeader.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import DealCard from '../components/cards/DealCard.jsx';
import { getFreeGames, getSales } from '../services/api.js';

export default function DealsPage() {
  const [activeTab, setActiveTab] = useState('free');
  const [state, setState] = useState({ loading: true, freeGames: [], sales: [] });

  useEffect(() => {
    async function load() {
      const [freeGames, sales] = await Promise.all([getFreeGames(), getSales()]);
      setState({ loading: false, freeGames, sales });
    }
    load();
  }, []);

  if (state.loading) return <LoadingState label="Scanning deals" />;

  const visibleDeals = activeTab === 'free' ? state.freeGames : state.sales;

  return (
    <>
      <PageHeader
        eyebrow="Free Games & Sales"
        title="Never miss a good deal"
        description="Track free games and major discounts in one demo-friendly view."
      />

      <div className="mb-6 inline-grid grid-cols-2 rounded-lg border border-white/10 bg-white/[0.05] p-1">
        <button
          className={`rounded-md px-4 py-2 text-sm font-bold transition ${activeTab === 'free' ? 'bg-mint text-night' : 'text-slate-300 hover:text-white'}`}
          onClick={() => setActiveTab('free')}
        >
          Free Games
        </button>
        <button
          className={`rounded-md px-4 py-2 text-sm font-bold transition ${activeTab === 'sales' ? 'bg-ember text-night' : 'text-slate-300 hover:text-white'}`}
          onClick={() => setActiveTab('sales')}
        >
          Discounts
        </button>
      </div>

      {visibleDeals.length === 0 ? (
        <EmptyState title="No deals found" message="The fallback radar has no games for this section yet." />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleDeals.map((deal) => (
            <DealCard key={deal.appid} deal={deal} />
          ))}
        </section>
      )}
    </>
  );
}
