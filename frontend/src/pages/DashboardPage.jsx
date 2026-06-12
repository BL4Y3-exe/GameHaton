import { useEffect, useState } from 'react';
import { Gamepad2, Gift, Library, RefreshCw, Timer } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Button from '../components/common/Button.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import StatCard from '../components/cards/StatCard.jsx';
import RecommendationCard from '../components/cards/RecommendationCard.jsx';
import DealCard from '../components/cards/DealCard.jsx';
import { getCurrentUser, getDashboardSummary, getFreeGames, getRevivalQueue, getSales, syncLibrary } from '../services/api.js';

export default function DashboardPage() {
  const [state, setState] = useState({ loading: true });
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [user, summary, queue, freeGames, sales] = await Promise.all([
          getCurrentUser(),
          getDashboardSummary(),
          getRevivalQueue(),
          getFreeGames(),
          getSales(),
        ]);
        setState({ loading: false, user, summary, queue, deals: [...freeGames, ...sales] });
      } catch (error) {
        setState({ loading: false, error: error.message || 'Could not load dashboard.' });
      }
    }
    load();
  }, []);

  async function handleSync() {
    setSyncing(true);

    try {
      await syncLibrary();
      const [summary, queue] = await Promise.all([
        getDashboardSummary(),
        getRevivalQueue(),
      ]);
      setState((current) => ({ ...current, summary, queue }));
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error.message || 'Could not sync Steam library.',
      }));
    } finally {
      setSyncing(false);
    }
  }

  if (state.loading) return <LoadingState label="Preparing dashboard" />;
  if (state.error) return <ErrorState message={state.error} />;

  const stats = [
    { label: 'Total games', value: state.summary.totalGames, icon: Library, tone: 'text-electric' },
    { label: 'Total playtime', value: `${state.summary.totalPlaytimeHours}h`, icon: Timer, tone: 'text-mint' },
    { label: 'Revival picks', value: state.summary.comebackRecommendations, icon: RefreshCw, tone: 'text-ember' },
    { label: 'Active deals', value: state.summary.activeDeals, icon: Gift, tone: 'text-rose-300' },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Welcome back, player"
        description="Your library, comeback picks, and deal radar are ready for the demo."
        action={<Button onClick={handleSync} loading={syncing}>Sync Library</Button>}
      />

      <section className="mb-6 flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.05] p-4">
        <img className="h-14 w-14 rounded-lg object-cover" src={state.user.avatarUrl} alt={state.user.displayName} />
        <div>
          <p className="font-black text-white">{state.user.displayName}</p>
          <p className="text-sm text-slate-400">{state.user.isDemo ? 'Demo account' : 'Steam account'}</p>
        </div>
        <Gamepad2 className="ml-auto hidden h-8 w-8 text-mint sm:block" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="mb-4 text-xl font-black">Top Revival Queue</h2>
          <div className="grid gap-4">
            {state.queue.slice(0, 3).map((item, index) => (
              <RecommendationCard key={item.appid} item={item} featured={index === 0} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-xl font-black">Free Games & Sales Preview</h2>
          <div className="grid gap-4">
            {state.deals.slice(0, 4).map((deal) => (
              <DealCard key={deal.appid} deal={deal} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
