# Encore Backend

Express API for the Encore hackathon MVP. This first version is fully usable
in demo mode without Steam or Supabase credentials.

## Requirements

- Node.js 18 or newer
- npm

## Local setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default.

For production, set a strong `JWT_SECRET`. The server refuses to start with the
example secret when `NODE_ENV=production`.

## Demo flow

Log in and save the returned token:

```bash
curl -X POST http://localhost:5000/api/auth/demo
```

Use it on protected routes:

```bash
curl http://localhost:5000/api/library \
  -H "Authorization: Bearer YOUR_TOKEN"
```

All successful responses use:

```json
{
  "success": true,
  "data": {}
}
```

All errors use:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## Endpoints

| Method | Endpoint | Auth | Status |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Working |
| POST | `/api/auth/demo` | No | Working |
| GET | `/api/auth/steam` | No | Working when Supabase is configured |
| GET | `/api/auth/steam/callback` | No | Steam callback and JWT redirect |
| GET | `/api/user/me` | Yes | Working |
| POST | `/api/library/sync` | Yes | Demo or Steam Web API sync |
| GET | `/api/library` | Yes | Demo data or saved Supabase games |
| GET | `/api/revival-queue` | Yes | Working with scored demo data |
| GET | `/api/free-games` | No | GamerPower with mock fallback |
| GET | `/api/sales` | No | CheapShark with mock fallback |
| GET | `/api/dashboard/summary` | Yes | Working with demo data |

The first demo login creates one in-memory demo account. Later demo logins reuse
the same stable user for the lifetime of the server process. The flow does not
need Steam or Supabase credentials.

## Steam login

Steam authentication uses OpenID and does not require a Steam API key. Set
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `BACKEND_URL`,
`STEAM_RETURN_URL`, and `FRONTEND_URL`, then open:

```text
http://localhost:5000/api/auth/steam
```

After Steam verifies the account, the backend upserts the user in Supabase,
issues a seven-day JWT, and redirects to:

```text
FRONTEND_URL/auth/steam/callback?token=JWT_TOKEN
```

`STEAM_API_KEY` is optional for login. When present, it is used to save the
Steam display name and avatar. Without it, the account is still created with a
fallback display name. Authentication failures redirect to
`FRONTEND_URL?steam_error=ERROR_CODE`.

For Render, update `BACKEND_URL` and `STEAM_RETURN_URL` to the deployed HTTPS
URL. Demo login remains available even when Steam or Supabase is not configured.

## Steam library sync

`POST /api/library/sync` uses mock games for the demo account. For a real Steam
user, it calls Steam's `GetOwnedGames` API and saves normalized rows to
Supabase's `user_games` table. Real sync requires `STEAM_API_KEY` and a public
Steam game-details setting.

`GET /api/library` returns mock games for the demo account and saved
`user_games` rows for real accounts. Both endpoints return:

```json
{
  "appid": 620,
  "name": "Portal 2",
  "image": "https://example.com/portal.jpg",
  "playtimeMinutes": 1200,
  "playtimeHours": 20,
  "lastPlayedAt": "2025-01-01T00:00:00.000Z",
  "genres": [],
  "tags": [],
  "storeUrl": "https://store.steampowered.com/app/620"
}
```

Steam's owned-games response does not include genres or tags, so those fields
start as empty arrays and can be enriched later. Steam API and private-library
failures use the standard error response without stopping the server.

The demo library contains 14 games with varied playtime, last-played dates,
genres, tags, Steam images, and store URLs. Revival Queue returns the top eight
games that have been inactive for at least 60 days. Its 0-100 score uses
playtime (40 points), inactivity (35), popularity (15), and a current
discount/free boost (10). Every result includes a readable reason.

Free Games uses the keyless GamerPower API, and Sales Radar uses the keyless
CheapShark API. Results are cached in memory for 10 minutes. If either service
times out, fails, or returns no usable games, the endpoint returns normalized
mock data so the demo remains functional.

Both deal endpoints normalize games to:

```json
{
  "appid": 292030,
  "name": "The Witcher 3: Wild Hunt",
  "image": "https://example.com/game.jpg",
  "originalPrice": 39.99,
  "currentPrice": 7.99,
  "discountPercent": 80,
  "isFree": false,
  "source": "CheapShark",
  "storeUrl": "https://example.com/deal"
}
```

## Supabase schema

The schema is in
[`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql).
It creates the `users`, `games`, and `user_games` tables in the `public`
schema.

To run it in Supabase:

1. Open your project in the [Supabase dashboard](https://supabase.com/dashboard).
2. Select **SQL Editor** from the project sidebar.
3. Choose **New query**.
4. Paste the contents of `supabase/migrations/001_initial_schema.sql`.
5. Click **Run**.
6. Open **Table Editor** and confirm that `users`, `games`, and `user_games`
   exist.

The migration uses `if not exists`, so it can be rerun safely while setting up
a fresh MVP project. If an older version of these tables already exists,
`create table if not exists` will not change its columns; apply the missing
columns manually or recreate the development tables before rerunning it.

The current demo mode keeps its data in code and does not require a Supabase
connection yet.

## Render deployment

The repository includes a root-level `render.yaml`. Create a Render Blueprint,
or create a Web Service manually with:

- Root directory: `backend`
- Build command: `npm ci`
- Start command: `npm start`
- Health check path: `/api/health`

Set these Render environment variables:

```text
NODE_ENV=production
FRONTEND_URL=https://YOUR-VERCEL-DOMAIN
BACKEND_URL=https://YOUR-RENDER-DOMAIN
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_ROTATED_SERVICE_ROLE_KEY
JWT_SECRET=YOUR_NEW_RANDOM_SECRET
STEAM_API_KEY=YOUR_ROTATED_STEAM_KEY
STEAM_RETURN_URL=https://YOUR-RENDER-DOMAIN/api/auth/steam/callback
USE_MOCK_STEAM=false
```

Do not set `PORT`; Render provides it. Production startup validates HTTPS URLs
and checks that `STEAM_RETURN_URL` matches `BACKEND_URL`.

Deploy the frontend on Vercel with:

- Root directory: `frontend`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:
  `VITE_API_URL=https://YOUR-RENDER-DOMAIN`

`frontend/vercel.json` provides the React Router SPA rewrite.

Recommended order:

1. Create Render and note its public HTTPS URL.
2. Deploy Vercel with `VITE_API_URL` set to the Render URL.
3. Set Render's `FRONTEND_URL` to the production Vercel URL.
4. Set Render's `BACKEND_URL` and `STEAM_RETURN_URL` to the Render URL.
5. Redeploy both services after changing environment variables.
6. Test health, demo login, Steam login, library sync, and a direct refresh of
   `/dashboard`.

Vercel preview URLs are not included in backend CORS. Use the production Vercel
domain for the demo, or update `FRONTEND_URL` for preview testing.
