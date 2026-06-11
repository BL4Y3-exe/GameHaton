import { mockLibrary, mockUser } from '../data/mockLibrary.js';
import { mockRecommendations } from '../data/mockRecommendations.js';
import { mockFreeGames, mockSales } from '../data/mockDeals.js';
import { getToken, saveSession } from './auth.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function getSteamLoginUrl() {
  return `${API_URL}/api/auth/steam`;
}

async function request(path, options = {}, fallback) {
  try {
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
    if (fallback !== undefined) return fallback;
    throw error;
  }
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
  saveSession(data);
  return data;
}

export function getCurrentUser() {
  return request('/api/user/me', {}, mockUser);
}

export function syncLibrary() {
  return request('/api/library/sync', { method: 'POST' }, { synced: true, games: mockLibrary.length });
}

export function getLibrary() {
  return request('/api/library', {}, mockLibrary);
}

export function getRevivalQueue() {
  return request('/api/revival-queue', {}, mockRecommendations);
}

export function getFreeGames() {
  return request('/api/free-games', {}, mockFreeGames);
}

export function getSales() {
  return request('/api/sales', {}, mockSales);
}

export function getDashboardSummary() {
  return request('/api/dashboard/summary', {}, dashboardSummary());
}
