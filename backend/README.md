# GameHaton Backend

Express API for the GameHaton hackathon MVP. This first version is fully usable
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
| GET | `/api/auth/steam` | No | Placeholder |
| GET | `/api/auth/steam/callback` | No | Placeholder |
| GET | `/api/user/me` | Yes | Working |
| POST | `/api/library/sync` | Yes | Working with demo data |
| GET | `/api/library` | Yes | Working with demo data |
| GET | `/api/revival-queue` | Yes | Working with scored demo data |
| GET | `/api/free-games` | No | GamerPower with mock fallback |
| GET | `/api/sales` | No | CheapShark with mock fallback |
| GET | `/api/dashboard/summary` | Yes | Working with demo data |

The first demo login creates one in-memory demo account. Later demo logins reuse
the same stable user for the lifetime of the server process. The flow does not
need Steam or Supabase credentials.

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

Create a Render Web Service with:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

Add the variables from `.env.example` in the Render environment settings.
