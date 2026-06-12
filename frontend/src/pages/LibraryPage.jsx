import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import GameCard from '../components/cards/GameCard.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { getLibrary } from '../services/api.js';

export default function LibraryPage() {
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getLibrary()
      .then(setGames)
      .catch((requestError) => {
        setError(requestError.message || 'Could not load library.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter((game) => game.name.toLowerCase().includes(query.toLowerCase()));
  }, [games, query]);

  if (loading) return <LoadingState label="Loading library" />;
  if (error) return <ErrorState message={error} />;

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Owned games"
        description="Search across your synced library and spot what has been sitting untouched."
      />

      <div className="mb-6 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.05] px-4">
        <Search className="h-5 w-5 text-slate-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search games"
          className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-500"
        />
      </div>

      {filteredGames.length === 0 ? (
        <EmptyState title="No games found" message="Try a different search term." />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredGames.map((game) => (
            <GameCard key={game.appid} game={game} />
          ))}
        </section>
      )}
    </>
  );
}
