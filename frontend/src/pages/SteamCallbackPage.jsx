import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingState from '../components/common/LoadingState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import Button from '../components/common/Button.jsx';
import { getCurrentUser, syncLibrary } from '../services/api.js';
import { saveSession } from '../services/auth.js';

const ERROR_MESSAGES = {
  STEAM_AUTH_CANCELLED: 'Steam login was cancelled.',
  STEAM_AUTH_INVALID: 'Steam could not verify this login.',
  INVALID_STEAM_ID: 'Steam returned an invalid account ID.',
  SUPABASE_ERROR: 'The Steam account could not be saved.',
  SUPABASE_NOT_CONFIGURED: 'Steam login is not configured on the server.',
};

export default function SteamCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    async function finishLogin() {
      const steamError = searchParams.get('steam_error');
      const token = searchParams.get('token');

      if (steamError) {
        setError(ERROR_MESSAGES[steamError] || 'Steam login failed.');
        return;
      }

      if (!token) {
        setError('Steam did not return a login token.');
        return;
      }

      try {
        saveSession({ token });
        const user = await getCurrentUser({ allowFallback: false });
        saveSession({ token, user });
        await syncLibrary();
        navigate('/dashboard', { replace: true });
      } catch (requestError) {
        setError(requestError.message || 'Could not finish Steam login.');
      }
    }

    finishLogin();
  }, [navigate, searchParams]);

  if (!error) {
    return (
      <main className="grid min-h-screen place-items-center bg-night px-4 text-white">
        <LoadingState label="Finishing Steam login" />
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-night px-4 text-white">
      <div className="w-full max-w-md space-y-4">
        <ErrorState message={error} />
        <Button onClick={() => navigate('/login', { replace: true })}>
          Back to login
        </Button>
      </div>
    </main>
  );
}
