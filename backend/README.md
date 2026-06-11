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
| GET | `/api/free-games` | No | Working with demo data |
| GET | `/api/sales` | No | Working with demo data |
| GET | `/api/dashboard/summary` | Yes | Working with demo data |

The demo library contains 14 games. Revival Queue scores games using playtime,
inactivity, popularity, and a discount boost, and includes a readable reason
for each recommendation.

## Supabase schema

Run [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)
in the Supabase SQL editor when database integration begins. The current demo
mode keeps its data in code and does not require a database connection.

## Render deployment

Create a Render Web Service with:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

Add the variables from `.env.example` in the Render environment settings.
