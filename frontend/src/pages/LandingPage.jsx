import { useNavigate } from 'react-router-dom';
import { Gamepad2, Gift, Library, RefreshCw, Sparkles } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Button from '../components/common/Button.jsx';
import { demoLogin, getSteamLoginUrl } from '../services/api.js';
import { mockRecommendations } from '../data/mockRecommendations.js';
import { mockSales } from '../data/mockDeals.js';

const features = [
  { title: 'Steam Library Sync', icon: Library, copy: 'Pull your owned games into one clean command center.' },
  { title: 'Comeback Recommendations', icon: Sparkles, copy: 'Find forgotten favorites worth replaying tonight.' },
  { title: 'Free Games & Sales Radar', icon: Gift, copy: 'Spot free games and major discounts before they pass.' },
  { title: 'Revival Queue', icon: RefreshCw, copy: 'Rank comeback picks by playtime, inactivity, and opportunity.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  async function handleDemo() {
    await demoLogin();
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen bg-night text-white">
      <Navbar />
      <main className="pt-16">
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">Encore</h1>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-300">
              Rediscover games you already own and never miss free games or major discounts.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleDemo}>Try Demo</Button>
              <Button as="a" href={getSteamLoginUrl()} variant="secondary">
                <Gamepad2 className="h-4 w-4" />
                Login with Steam
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-glow">
            <div className="rounded-lg bg-panel p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-mint">Revival Queue</p>
                  <h2 className="mt-1 text-2xl font-black">{mockRecommendations[0].name}</h2>
                </div>
                <div className="rounded-lg bg-mint px-3 py-2 text-2xl font-black text-night">94</div>
              </div>
              <img className="mt-4 aspect-[16/7] w-full rounded-lg object-cover" src={mockRecommendations[0].image} alt={mockRecommendations[0].name} />
              <p className="mt-4 text-sm leading-6 text-slate-300">{mockRecommendations[0].reason}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {mockSales.slice(0, 2).map((deal) => (
                  <div key={deal.appid} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-xs font-bold text-slate-400">Deal radar</p>
                    <p className="mt-1 line-clamp-1 font-black">{deal.name}</p>
                    <p className="text-sm font-bold text-ember">-{deal.discountPercent}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border border-white/10 bg-white/[0.05] p-5">
                <feature.icon className="h-6 w-6 text-mint" />
                <h3 className="mt-4 text-lg font-black">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.copy}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
