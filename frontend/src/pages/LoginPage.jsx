import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { demoLogin, getSteamLoginUrl } from '../services/api.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDemoLogin() {
    setLoading(true);
    setError('');

    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.message || 'Demo login failed.');
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-night px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-glow">
        <div className="grid h-12 w-12 place-items-center rounded-lg bg-mint text-night">
          <Gamepad2 className="h-6 w-6" />
        </div>
        <h1 className="mt-6 text-3xl font-black">Sign in to Encore</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Demo mode uses presentation-ready mock data now and will call the backend demo endpoint when it is available.
        </p>
        <div className="mt-6 grid gap-3">
          {error ? <ErrorState message={error} /> : null}
          <Button as="a" href={getSteamLoginUrl()} variant="secondary">
            <Gamepad2 className="h-4 w-4" />
            Login with Steam
          </Button>
          <Button onClick={handleDemoLogin} loading={loading}>
            Try Demo Account
          </Button>
        </div>
      </section>
    </main>
  );
}
