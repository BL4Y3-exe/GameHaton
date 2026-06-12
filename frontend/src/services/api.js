import { mockLibrary, mockUser } from '../data/mockLibrary.js';
import { mockRecommendations } from '../data/mockRecommendations.js';
import { mockFreeGames, mockSales } from '../data/mockDeals.js';
import { getToken, saveSession } from './auth.js';

const API_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : '')
).replace(/\/$/, '');

export function getSteamLoginUrl() {
  ensureApiUrl();
  return `${API_URL}/api/auth/steam`;
}

async function request(path, options = {}, fallback) {
  try {
    ensureApiUrl();
    const token = getToken();
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const payload = await response.json();
    if (!response.ok || !payload.success) {
      throw new Error(payload.error?.message || 'Request failed');
    }

    return payload.data;
  } catch (error) {
    if (import.meta.env.DEV && fallback !== undefined) return fallback;
    throw error;
  }
}

function ensureApiUrl() {
  if (!API_URL) {
    throw new Error('VITE_API_URL is not configured for this deployment.');
  }
}

function normalizeUser(user) {
  if (!user) return mockUser;

  return {
    id: user.id,
    displayName: user.displayName ?? user.display_name ?? 'Player',
    avatarUrl: user.avatarUrl ?? user.avatar_url ?? null,
    isDemo: user.isDemo ?? user.is_demo ?? false,
    steamId: user.steamId ?? user.steam_id ?? null,
  };
}

function dashboardSummary() {
  const totalPlaytime = mockLibrary.reduce((sum, game) => sum + game.playtimeHours, 0);
  return {
    totalGames: mockLibrary.length,
    totalPlaytimeHours: Math.round(totalPlaytime),
    comebackRecommendations: mockRecommendations.length,
    activeDeals: mockFreeGames.length + mockSales.length,
  };
}

export async function demoLogin() {
  const fallback = {
    token: 'mock-demo-token',
    user: mockUser,
  };
  const data = await request('/api/auth/demo', { method: 'POST' }, fallback);
  const session = {
    token: data.token,
    user: normalizeUser(data.user),
  };
  saveSession(session);
  return session;
}

export async function getCurrentUser({ allowFallback = true } = {}) {
  const fallback = allowFallback ? { user: mockUser } : undefined;
  const data = await request('/api/user/me', {}, fallback);
  return normalizeUser(data.user ?? data);
}

export async function syncLibrary() {
  const data = await request(
    '/api/library/sync',
    { method: 'POST' },
    { games: mockLibrary, syncedCount: mockLibrary.length, source: 'mock' },
  );

  return {
    games: data.games ?? [],
    syncedCount: data.syncedCount ?? data.synced_count ?? data.games?.length ?? 0,
    source: data.source ?? 'unknown',
  };
}

export async function getLibrary() {
  const data = await request('/api/library', {}, { games: mockLibrary });
  return Array.isArray(data) ? data : data.games ?? [];
}

export async function getRevivalQueue() {
  const data = await request(
    '/api/revival-queue',
    {},
    { recommendations: mockRecommendations },
  );
  return Array.isArray(data) ? data : data.recommendations ?? [];
}

export async function getFreeGames() {
  const data = await request('/api/free-games', {}, { games: mockFreeGames });
  return Array.isArray(data) ? data : data.games ?? [];
}

export async function getSales() {
  const data = await request('/api/sales', {}, { sales: mockSales });
  return Array.isArray(data) ? data : data.sales ?? [];
}

export async function getDashboardSummary() {
  const data = await request(
    '/api/dashboard/summary',
    {},
    dashboardSummary(),
  );

  if ('totalGames' in data) return data;

  return {
    totalGames: data.total_games ?? 0,
    totalPlaytimeHours: data.total_playtime_hours ?? 0,
    comebackRecommendations: data.comeback_recommendations ?? 0,
    activeDeals: (data.free_games ?? 0) + (data.sales ?? 0),
    topRecommendedGame: data.top_recommended_game ?? null,
  };
}
