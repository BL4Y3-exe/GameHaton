# API Contract — GameHaton MVP

This document defines the shared contract between the frontend and backend teams.

Both frontend and backend must follow this file.  
If something changes in the API, update this file first, then update the code.

---

## 1. Project Overview

GameHaton is a gaming web app that helps users:

1. Sync their Steam library.
2. Rediscover games they already own.
3. Get comeback recommendations through Revival Queue.
4. Find free games and discounted games.
5. Use a demo account for hackathon presentation.

The product must be demo-ready and deployed.

---

## 2. Team Responsibilities

### Backend Owner

Works only inside:

```text
/backend
```

Responsible for:

- Node.js + Express API
- Steam OpenID login
- Steam Web API integration
- Supabase database
- Demo account logic
- Library sync
- Revival Queue recommendation logic
- Free games and sales API
- API response format

### Frontend Owner

Works only inside:

```text
/frontend
```

Responsible for:

- React + Vite app
- Landing page
- Login page
- Dashboard
- Library page
- Revival Queue page
- Free Games & Sales page
- Demo account UI flow
- API integration with backend

### Shared Files

Both teammates can read and update only when agreed:

```text
README.md
API_CONTRACT.md
.env.example
```

---

## 3. Tech Stack

### Frontend

```text
React
Vite
Tailwind CSS
Deployment: Vercel
```

### Backend

```text
Node.js
Express.js
Deployment: Render
```

### Database

```text
Supabase PostgreSQL
```

### External APIs

```text
Steam OpenID
Steam Web API
Steam Store API
CheapShark API or another free deals API
```

### Auth

```text
JWT-based auth for MVP
Steam OpenID for real users
Demo account for presentation
```

---

## 4. Local Development URLs

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:5000
```

### Backend API Base URL

```text
http://localhost:5000/api
```

Frontend must use:

```text
VITE_API_URL=http://localhost:5000
```

Backend must allow CORS from:

```text
http://localhost:5173
```

---

## 5. Environment Variables

### Frontend `.env.example`

```env
VITE_API_URL=http://localhost:5000
```

### Backend `.env.example`

```env
PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

JWT_SECRET=change_me

STEAM_API_KEY=
STEAM_RETURN_URL=http://localhost:5000/api/auth/steam/callback

USE_MOCK_STEAM=true
```

---

## 6. Standard API Response Format

All successful responses must follow this format:

```json
{
  "success": true,
  "data": {}
}
```

All error responses must follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Something went wrong",
    "code": "SOME_ERROR_CODE"
  }
}
```

Do not return raw arrays directly.

Incorrect:

```json
[
  {
    "name": "Game"
  }
]
```

Correct:

```json
{
  "success": true,
  "data": {
    "games": [
      {
        "name": "Game"
      }
    ]
  }
}
```

---

## 7. Authentication

Backend issues a JWT token after:

1. Demo login.
2. Steam login.

Frontend stores the token in `localStorage`.

Frontend sends the token in protected requests:

```http
Authorization: Bearer <token>
```

Protected endpoints:

```text
GET  /api/user/me
POST /api/library/sync
GET  /api/library
GET  /api/revival-queue
GET  /api/dashboard/summary
```

Public endpoints:

```text
GET  /api/health
POST /api/auth/demo
GET  /api/auth/steam
GET  /api/auth/steam/callback
GET  /api/free-games
GET  /api/sales
```

---

## 8. Main Data Models

### User Object

```json
{
  "id": "uuid",
  "steamId": "76561198000000000",
  "displayName": "Demo Player",
  "avatarUrl": "https://...",
  "isDemo": true
}
```

Notes:

- `steamId` can be `null` for demo users.
- `isDemo` is `true` only for demo account.

---

### Game Object

This object is used for the library.

```json
{
  "appid": 730,
  "name": "Counter-Strike 2",
  "image": "https://...",
  "playtimeMinutes": 1240,
  "playtimeHours": 20.7,
  "lastPlayedAt": "2024-11-20T12:00:00.000Z",
  "genres": ["Shooter", "Competitive"],
  "tags": ["FPS", "Multiplayer"],
  "isFree": true,
  "currentPrice": 0,
  "originalPrice": 0,
  "discountPercent": 0,
  "storeUrl": "https://store.steampowered.com/app/730"
}
```

Field rules:

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `appid` | number | yes | Steam app id |
| `name` | string | yes | Game name |
| `image` | string | yes | Header/capsule image |
| `playtimeMinutes` | number | yes | Total playtime in minutes |
| `playtimeHours` | number | yes | Rounded hours |
| `lastPlayedAt` | string or null | yes | ISO date or null |
| `genres` | string[] | yes | Can be empty |
| `tags` | string[] | yes | Can be empty |
| `isFree` | boolean | no | Optional for library |
| `currentPrice` | number | no | Optional for library |
| `originalPrice` | number | no | Optional for library |
| `discountPercent` | number | no | Optional for library |
| `storeUrl` | string | yes | Steam/store link |

---

### Revival Queue Item

```json
{
  "appid": 292030,
  "name": "The Witcher 3: Wild Hunt",
  "image": "https://...",
  "playtimeHours": 86,
  "lastPlayedAt": "2023-02-14T18:30:00.000Z",
  "revivalScore": 94,
  "reason": "You played this game a lot before, but have not returned to it for a long time.",
  "tags": ["RPG", "Open World", "Story Rich"],
  "storeUrl": "https://store.steampowered.com/app/292030"
}
```

Field rules:

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `appid` | number | yes | Steam app id |
| `name` | string | yes | Game name |
| `image` | string | yes | Game image |
| `playtimeHours` | number | yes | Total playtime |
| `lastPlayedAt` | string or null | yes | ISO date or null |
| `revivalScore` | number | yes | 0–100 |
| `reason` | string | yes | Human-readable explanation |
| `tags` | string[] | yes | Can be empty |
| `storeUrl` | string | yes | Store link |

---

### Deal / Free Game Object

```json
{
  "appid": 12345,
  "name": "Example Game",
  "image": "https://...",
  "originalPrice": 29.99,
  "currentPrice": 4.99,
  "discountPercent": 83,
  "isFree": false,
  "source": "Steam",
  "storeUrl": "https://..."
}
```

Field rules:

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `appid` | number or null | yes | Can be null if source is not Steam |
| `name` | string | yes | Game name |
| `image` | string | yes | Game image |
| `originalPrice` | number | yes | Original price |
| `currentPrice` | number | yes | Current price |
| `discountPercent` | number | yes | Discount percent |
| `isFree` | boolean | yes | True if current price is 0 |
| `source` | string | yes | Steam, Epic, CheapShark, etc. |
| `storeUrl` | string | yes | Store link |

---

## 9. API Endpoints

---

# Health

## GET `/api/health`

Purpose:

Check if backend is running.

Auth:

Not required.

Success response:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "GameHaton API",
    "timestamp": "2026-06-11T12:00:00.000Z"
  }
}
```

---

# Auth

## POST `/api/auth/demo`

Purpose:

Login as demo user for hackathon presentation.

Auth:

Not required.

Request body:

```json
{}
```

Success response:

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "demo-user-id",
      "steamId": null,
      "displayName": "Demo Player",
      "avatarUrl": "https://...",
      "isDemo": true
    }
  }
}
```

Frontend behavior:

- Save `token` to `localStorage`.
- Redirect user to `/dashboard`.

---

## GET `/api/auth/steam`

Purpose:

Start Steam OpenID login flow.

Auth:

Not required.

Frontend behavior:

Redirect browser to this URL:

```js
window.location.href = `${VITE_API_URL}/api/auth/steam`
```

Expected backend behavior:

- Redirect user to Steam login page.

---

## GET `/api/auth/steam/callback`

Purpose:

Handle Steam OpenID callback.

Auth:

Not required.

Expected backend behavior:

- Validate Steam OpenID response.
- Extract Steam ID.
- Create or update user in Supabase.
- Generate JWT token.
- Redirect back to frontend.

Redirect example:

```text
http://localhost:5173/auth/callback?token=jwt_token_here
```

Frontend behavior:

- Read token from URL.
- Store token in `localStorage`.
- Redirect to `/dashboard`.

---

# User

## GET `/api/user/me`

Purpose:

Get current authenticated user.

Auth:

Required.

Success response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "steamId": "76561198000000000",
      "displayName": "Player Name",
      "avatarUrl": "https://...",
      "isDemo": false
    }
  }
}
```

Error response if token is missing or invalid:

```json
{
  "success": false,
  "error": {
    "message": "Unauthorized",
    "code": "UNAUTHORIZED"
  }
}
```

---

# Library

## POST `/api/library/sync`

Purpose:

Sync current user's Steam library.

Auth:

Required.

Request body:

```json
{}
```

Success response:

```json
{
  "success": true,
  "data": {
    "message": "Library synced successfully",
    "totalGames": 42,
    "syncedAt": "2026-06-11T12:00:00.000Z"
  }
}
```

Demo behavior:

- If user is demo user, backend uses mock demo library.

Real Steam behavior:

- If user is real Steam user, backend uses Steam Web API.

Error response:

```json
{
  "success": false,
  "error": {
    "message": "Failed to sync Steam library",
    "code": "LIBRARY_SYNC_FAILED"
  }
}
```

---

## GET `/api/library`

Purpose:

Get current user's saved library.

Auth:

Required.

Query params:

```text
search optional string
limit optional number
offset optional number
```

Example:

```http
GET /api/library?search=witcher&limit=20&offset=0
```

Success response:

```json
{
  "success": true,
  "data": {
    "games": [
      {
        "appid": 292030,
        "name": "The Witcher 3: Wild Hunt",
        "image": "https://...",
        "playtimeMinutes": 5160,
        "playtimeHours": 86,
        "lastPlayedAt": "2023-02-14T18:30:00.000Z",
        "genres": ["RPG"],
        "tags": ["Open World", "Story Rich"],
        "isFree": false,
        "currentPrice": 9.99,
        "originalPrice": 39.99,
        "discountPercent": 75,
        "storeUrl": "https://store.steampowered.com/app/292030"
      }
    ],
    "total": 1
  }
}
```

---

# Revival Queue

## GET `/api/revival-queue`

Purpose:

Get comeback recommendations for current user.

Auth:

Required.

Query params:

```text
limit optional number
```

Example:

```http
GET /api/revival-queue?limit=8
```

Success response:

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "appid": 292030,
        "name": "The Witcher 3: Wild Hunt",
        "image": "https://...",
        "playtimeHours": 86,
        "lastPlayedAt": "2023-02-14T18:30:00.000Z",
        "revivalScore": 94,
        "reason": "You played this game a lot before, but have not returned to it for a long time.",
        "tags": ["RPG", "Open World", "Story Rich"],
        "storeUrl": "https://store.steampowered.com/app/292030"
      }
    ]
  }
}
```

Recommendation rules for MVP:

```text
revivalScore = playtimeWeight + inactivityWeight + popularityWeight + discountBoost
```

Simple logic:

- More playtime = higher score.
- Longer inactivity = higher score.
- Popular/recognizable games can receive small boost.
- Games currently discounted or free can receive small boost.

Score must be between `0` and `100`.

Every item must include a clear `reason`.

---

# Deals

## GET `/api/free-games`

Purpose:

Get currently free games.

Auth:

Not required.

Success response:

```json
{
  "success": true,
  "data": {
    "games": [
      {
        "appid": 12345,
        "name": "Example Free Game",
        "image": "https://...",
        "originalPrice": 19.99,
        "currentPrice": 0,
        "discountPercent": 100,
        "isFree": true,
        "source": "Steam",
        "storeUrl": "https://..."
      }
    ]
  }
}
```

Fallback rule:

If external API fails, backend should return mock free games instead of crashing.

---

## GET `/api/sales`

Purpose:

Get discounted games.

Auth:

Not required.

Query params:

```text
minDiscount optional number
limit optional number
```

Example:

```http
GET /api/sales?minDiscount=50&limit=12
```

Success response:

```json
{
  "success": true,
  "data": {
    "games": [
      {
        "appid": 12345,
        "name": "Example Discounted Game",
        "image": "https://...",
        "originalPrice": 29.99,
        "currentPrice": 4.99,
        "discountPercent": 83,
        "isFree": false,
        "source": "Steam",
        "storeUrl": "https://..."
      }
    ]
  }
}
```

Fallback rule:

If external API fails, backend should return mock sales instead of crashing.

---

# Dashboard

## GET `/api/dashboard/summary`

Purpose:

Get all main dashboard stats.

Auth:

Required.

Success response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "steamId": "76561198000000000",
      "displayName": "Player Name",
      "avatarUrl": "https://...",
      "isDemo": false
    },
    "stats": {
      "totalGames": 42,
      "totalPlaytimeHours": 1260,
      "revivalRecommendationsCount": 8,
      "activeDealsCount": 12,
      "freeGamesCount": 3
    },
    "topRecommendation": {
      "appid": 292030,
      "name": "The Witcher 3: Wild Hunt",
      "image": "https://...",
      "playtimeHours": 86,
      "lastPlayedAt": "2023-02-14T18:30:00.000Z",
      "revivalScore": 94,
      "reason": "You played this game a lot before, but have not returned to it for a long time.",
      "tags": ["RPG", "Open World", "Story Rich"],
      "storeUrl": "https://store.steampowered.com/app/292030"
    },
    "preview": {
      "recommendations": [],
      "freeGames": [],
      "sales": []
    }
  }
}
```

Notes:

- `preview.recommendations` should contain top 3 recommendations.
- `preview.freeGames` should contain top 3 free games.
- `preview.sales` should contain top 3 discounted games.

---

## 10. Frontend Routes

Frontend should use these routes:

```text
/                  Landing Page
/login             Login Page
/auth/callback     Steam auth callback handler
/dashboard         Dashboard
/library           User library
/revival-queue     Comeback recommendations
/deals             Free games and sales
```

Protected frontend pages:

```text
/dashboard
/library
/revival-queue
```

Public frontend pages:

```text
/
/login
/auth/callback
/deals
```

---

## 11. Frontend API Service Function Names

Frontend should create these functions in:

```text
/frontend/src/services/api.js
```

Required functions:

```js
healthCheck()

demoLogin()

getCurrentUser()

syncLibrary()

getLibrary({ search, limit, offset })

getRevivalQueue({ limit })

getFreeGames()

getSales({ minDiscount, limit })

getDashboardSummary()
```

---

## 12. Local Storage Keys

Frontend should use these exact keys:

```text
gamehaton_token
gamehaton_user
```

Do not use random different names like:

```text
token
authToken
steam_token
```

---

## 13. Error Codes

Backend should use these error codes where possible:

```text
UNAUTHORIZED
FORBIDDEN
VALIDATION_ERROR
USER_NOT_FOUND
STEAM_AUTH_FAILED
STEAM_API_FAILED
LIBRARY_SYNC_FAILED
LIBRARY_NOT_FOUND
RECOMMENDATION_FAILED
DEALS_API_FAILED
INTERNAL_SERVER_ERROR
```

---

## 14. Supabase Schema

Backend should create these tables.

### users

```sql
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  steam_id text unique,
  display_name text not null,
  avatar_url text,
  is_demo boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### games

```sql
create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  appid integer unique not null,
  name text not null,
  image text,
  genres jsonb default '[]'::jsonb,
  tags jsonb default '[]'::jsonb,
  store_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### user_games

```sql
create table if not exists user_games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  appid integer not null,
  name text not null,
  image text,
  playtime_minutes integer default 0,
  playtime_hours numeric default 0,
  last_played_at timestamp with time zone,
  genres jsonb default '[]'::jsonb,
  tags jsonb default '[]'::jsonb,
  store_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, appid)
);
```

---

## 15. Demo Account Requirements

Demo account must work even if:

- Steam API key is missing.
- Supabase has temporary issues.
- External deals API fails.

For the hackathon demo, the app must still show:

```text
At least 12 library games
At least 5 Revival Queue recommendations
At least 3 free games
At least 6 discounted games
Dashboard stats
```

Demo library should include realistic data:

```text
Different playtime values
Different last played dates
Different genres/tags
Realistic Steam store URLs
Realistic game images if possible
```

---

## 16. MVP Priority

### Must-have

```text
Landing Page
Demo Account
Dashboard
Mock/Demo Library
Revival Queue
Free Games & Sales Page
Deployment
```

### Should-have

```text
Real Steam Library Sync
Supabase storage
Real sales/free games API
```

### Nice-to-have

```text
Full Steam OAuth polish
Advanced recommendation algorithm
User settings
Complex filters
```

---

## 17. Integration Checklist

Before final demo, check:

```text
Frontend VITE_API_URL points to deployed backend.
Backend FRONTEND_URL points to deployed frontend.
CORS allows deployed frontend URL.
Demo login works.
JWT token is stored as gamehaton_token.
Protected requests send Authorization header.
Dashboard loads after demo login.
Library page loads games.
Revival Queue page loads recommendations.
Deals page loads free games and sales.
All endpoints return { success, data } or { success, error }.
No frontend code expects raw arrays from backend.
No backend endpoint returns raw arrays.
Steam failure does not break demo mode.
External deals API failure does not break demo mode.
```

---

## 18. Naming Rules

Use these exact names to avoid frontend/backend mismatch.

Correct names:

```text
playtimeMinutes
playtimeHours
lastPlayedAt
revivalScore
discountPercent
currentPrice
originalPrice
storeUrl
avatarUrl
displayName
isDemo
```

Avoid these names:

```text
playtime
hoursPlayed
last_played
lastPlayed
score
discount
price
oldPrice
url
avatar
username
demo
```

---

## 19. Final Notes

This API contract is optimized for speed.

The goal is not perfect architecture.  
The goal is a working, deployed, impressive MVP.

If there is a conflict between real Steam integration and demo stability, demo stability wins.

The recommended development order:

1. Demo account end-to-end.
2. Dashboard with demo data.
3. Revival Queue with demo data.
4. Deals page with fallback data.
5. Supabase persistence.
6. Steam login.
7. Real Steam library sync.
8. Final deployment and polish.
