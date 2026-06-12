import { useEffect, useState } from 'react';
import PageHeader from '../components/layout/PageHeader.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import RecommendationCard from '../components/cards/RecommendationCard.jsx';
import { getRevivalQueue } from '../services/api.js';

export default function RevivalQueuePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getRevivalQueue()
      .then((data) => {
        setItems([...data].sort((a, b) => b.revivalScore - a.revivalScore));
      })
      .catch((requestError) => {
        setError(requestError.message || 'Could not load Revival Queue.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Scoring comeback games" />;
  if (error) return <ErrorState message={error} />;

  return (
    <>
      <PageHeader
        eyebrow="Revival Queue"
        title="Games worth coming back to"
        description="Ranked by playtime, inactivity, recognizable titles, and comeback potential."
      />

      {items.length === 0 ? (
        <EmptyState title="No recommendations yet" message="Sync your library to build your first Revival Queue." />
      ) : (
        <section className="grid gap-5">
          {items.map((item, index) => (
            <RecommendationCard key={item.appid} item={item} featured={index === 0} />
          ))}
        </section>
      )}
    </>
  );
}
