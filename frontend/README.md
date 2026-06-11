# GameHaton Frontend

React + Vite frontend for the GameHaton hackathon MVP.

## Setup

```bash
npm install
npm run dev
```

The app runs on Vite, usually at `http://localhost:5173`.

## Environment

Copy `.env.example` to `.env` when connecting to the backend:

```bash
VITE_API_URL=http://localhost:5000
```

## Current MVP

- Landing page with demo and Steam login CTAs
- Login page with mock demo account flow
- Dashboard with profile, stats, Revival Queue preview, and deals preview
- Library page with searchable mock Steam library
- Revival Queue page with comeback recommendations
- Free Games & Sales page with free games and discount sections
- API service shaped around the agreed backend contract

## Backend Integration Notes

`src/services/api.js` already exposes:

- `demoLogin()`
- `getCurrentUser()`
- `syncLibrary()`
- `getLibrary()`
- `getRevivalQueue()`
- `getFreeGames()`
- `getSales()`
- `getDashboardSummary()`

For now these helpers use mock fallback data if the backend is unavailable. When the backend is ready, set `VITE_API_URL` and the same helpers can call the real endpoints.
