# Encore

**Encore** is a web service that helps players rediscover games they already own, track free games and discounts, and decide what to play next based on their gaming activity.

Many players have large Steam libraries, but most of the games stay forgotten forever. GameHaton solves this problem by analyzing a user’s game library and creating a personalized **Revival Queue** — a ranked list of games that are worth coming back to.

The goal of the project is simple:
**help gamers stop endlessly scrolling through their library and actually start playing.**

---

## What the service does

Encore gives users a smarter way to manage their gaming backlog.

The main features are:

* **Steam Library Sync**
  The user can connect or import their Steam library, so the system can understand what games they already own.

* **Comeback Recommendations**
  The service recommends games that are worth returning to based on different factors such as playtime, last activity, rating, popularity, and current relevance.

* **Revival Queue**
  A personalized queue of games ranked by how good they are for a comeback.

* **Free Games & Sales Radar**
  The service can show free games, discounts, and sales so users can discover new games without manually checking multiple stores.

* **Demo Account**
  A prepared demo account can be used during presentation or testing, so the project works even without connecting a real Steam account.

* **Landing Page**
  A simple public page that explains what the product does before the user signs in.

---

## Why this project is useful

Gamers often face the same problems:

* they own many games but do not know what to play;
* they forget about older games in their library;
* they buy new games while ignoring good games they already own;
* they spend too much time choosing instead of playing;
* they miss free games and discounts.

GameHaton turns a messy game library into a useful recommendation system.

Instead of showing random games, the service tries to answer one practical question:

> “Which game from my library is actually worth playing again right now?”

---

## Core concept: Revival Queue

The **Revival Queue** is the main recommendation feature of GameHaton.

It is a ranked list of games from the user’s library. Each game gets a **Revival Score**, and games with a higher score appear higher in the queue.

The Revival Queue is not just based on one metric. It combines several criteria to understand whether a game is a good comeback candidate.

---

# Revival Score

## What is Revival Score?

**Revival Score** is a numeric score that shows how suitable a game is for returning to.

A high Revival Score means:

* the game is probably still interesting;
* the user has not played it recently;
* the game has enough quality or popularity signals;
* the user has a reason to continue or restart it;
* the game is a better comeback option than other games in the library.

The score is used to sort games inside the Revival Queue.

---

## Main criteria

The Revival Score is calculated using several criteria.

Each criterion gives the game a partial score. Then all partial scores are combined into one final score.

Recommended final score range:

```txt
0 - 100
```

Where:

```txt
0   = not a good comeback candidate
100 = excellent comeback candidate
```

---

## 1. Time Since Last Played

This criterion checks how long it has been since the user last played the game.

The idea is simple:
if the user has not played a game for a long time, it may be a good candidate for revival.

Example logic:

```txt
Recently played game       → lower score
Not played for months      → medium score
Not played for a year+      → higher score
Never launched             → special backlog score
```

Suggested scoring:

```txt
Played in the last 7 days       → 0 points
Played in the last 30 days      → 10 points
Played in the last 3 months     → 20 points
Played in the last 6 months     → 30 points
Played more than 1 year ago     → 40 points
Never played                    → 35 points
```

Why never played is not always the maximum:
a game that was played before may have stronger comeback potential than a game the user never touched.

---

## 2. Playtime Potential

This criterion checks how much the user has already played the game.

The goal is to detect games that were started but not fully explored.

Example logic:

```txt
0 hours        → backlog game
1-3 hours      → tried briefly, could deserve another chance
5-20 hours     → strong comeback candidate
100+ hours     → maybe already fully explored
```

Suggested scoring:

```txt
0 hours played          → 20 points
1-3 hours played        → 30 points
4-20 hours played       → 40 points
21-60 hours played      → 30 points
60+ hours played        → 15 points
```

The best candidates are often games with some playtime, but not too much.
This means the user already showed interest, but probably did not finish or fully explore the game.

---

## 3. User Interest Signal

This criterion estimates whether the user actually cared about the game before.

Possible indicators:

* the user played the game more than once;
* the game has several hours of playtime;
* the game belongs to genres the user often plays;
* the game is similar to other games the user played a lot.

Suggested scoring:

```txt
No clear interest signal       → 0-10 points
Some interest                  → 15-25 points
Strong interest                → 30-40 points
```

Example:

If the user has 80 hours in survival games and owns another survival game with only 2 hours played, that game may receive a higher interest score.

---

## 4. Game Quality

This criterion checks whether the game is generally considered good.

Possible data sources:

* Steam review score;
* total number of reviews;
* popularity;
* rating from external APIs if available.

Suggested scoring:

```txt
Mixed or low-rated game         → 0-10 points
Mostly positive reviews         → 20 points
Very positive reviews           → 30 points
Overwhelmingly positive reviews → 40 points
```

This prevents the queue from recommending random low-quality games only because they are old or unplayed.

---

## 5. Current Relevance

This criterion checks whether the game is relevant right now.

A game can become more relevant because of:

* a new update;
* a new DLC;
* a sequel announcement;
* a current discount;
* an active player base;
* trending popularity;
* seasonal events.

Suggested scoring:

```txt
No current activity             → 0 points
Small update or discount        → 10 points
Major update / DLC / event      → 20-30 points
Trending again                  → 30-40 points
```

This makes the Revival Queue feel alive and connected to what is happening now.

---

## 6. Completion / Unfinished Potential

This criterion checks whether the game looks unfinished for the user.

A game may receive extra points if:

* the user played it for a few hours but not enough to complete it;
* the game has achievements but the user unlocked only a small part;
* the user stopped playing after the beginning;
* the game is story-based and likely unfinished.

Suggested scoring:

```txt
Probably finished               → 0-10 points
Unclear progress                → 15 points
Likely unfinished               → 25-35 points
```

This is useful because unfinished games are often the best comeback candidates.

---

# Example Revival Score Formula

A simple version of the score can look like this:

```txt
Revival Score =
  Time Since Last Played Score
+ Playtime Potential Score
+ User Interest Score
+ Game Quality Score
+ Current Relevance Score
+ Unfinished Potential Score
```

Then the result can be normalized to a 0-100 scale.

Example:

```txt
Game: Hollow Knight

Time Since Last Played: 35
Playtime Potential: 40
User Interest: 30
Game Quality: 40
Current Relevance: 10
Unfinished Potential: 30

Raw Score = 185
Normalized Revival Score = 92/100
```

Result:

```txt
Hollow Knight appears very high in the Revival Queue.
```

---

# Recommended weighted formula

For a more balanced system, weighted scoring can be used.

```txt
Revival Score =
  25% Time Since Last Played
+ 20% Playtime Potential
+ 20% User Interest
+ 15% Game Quality
+ 10% Current Relevance
+ 10% Unfinished Potential
```

This makes the score more realistic because not every criterion should have the same importance.

For example, user activity should matter more than temporary popularity.

---

## Score interpretation

```txt
90-100  → Must revive
75-89   → Strong comeback candidate
60-74   → Worth considering
40-59   → Low priority
0-39    → Not recommended right now
```

---

## Example Revival Queue

```txt
1. Hollow Knight       — Revival Score: 92
2. Cyberpunk 2077      — Revival Score: 87
3. Terraria            — Revival Score: 81
4. Portal 2            — Revival Score: 76
5. The Witcher 3       — Revival Score: 71
```

Each game can also have a short explanation:

```txt
Recommended because you played it before, left it unfinished, and it has very positive reviews.
```

This explanation is important because users should understand why a game was recommended.

---

# Technical overview

## Frontend

The frontend is responsible for:

* landing page;
* authentication UI;
* user dashboard;
* Steam library display;
* Revival Queue page;
* free games and sales page;
* game cards and score explanations.

Recommended stack:

```txt
React + Vite
```

---

## Backend

The backend is responsible for:

* user authentication logic;
* Steam API integration;
* fetching and storing game library data;
* calculating Revival Score;
* generating the Revival Queue;
* providing API endpoints for the frontend.

Recommended stack:

```txt
Node.js / Express
```

---

## Database

The database stores:

* users;
* connected Steam accounts;
* imported game libraries;
* playtime data;
* calculated scores;
* saved recommendations;
* free games and sales data if needed.

Recommended service:

```txt
Supabase
```

---

## Deployment

Recommended deployment setup:

```txt
Frontend: Vercel
Backend: Render
Database: Supabase
```

---

# Possible API flow

## 1. User connects Steam

The user provides a Steam ID or connects their Steam account.

The backend fetches owned games and playtime data.

---

## 2. Backend stores library

The backend saves the user’s library in the database.

Each game record may include:

```txt
game_id
name
playtime
last_played
steam_review_score
store_url
cover_image
```

---

## 3. Backend calculates Revival Score

For each game, the backend calculates partial scores:

```txt
time_since_last_played_score
playtime_score
interest_score
quality_score
relevance_score
unfinished_score
```

Then it calculates:

```txt
final_revival_score
```

---

## 4. Frontend displays Revival Queue

The frontend displays a ranked list of games.

Each card should show:

```txt
game title
cover image
Revival Score
short explanation
playtime
last played date
reason for recommendation
```

---

# Demo mode

For hackathon presentation, the project should include a demo account.

The demo account should contain preloaded game data, so the full product can be shown without depending on a real Steam account.

Demo mode should include:

* sample Steam library;
* calculated Revival Queue;
* several recommended games;
* free games and sales examples;
* realistic playtime data;
* explanations for each recommendation.

This makes the product easier to present and avoids problems with Steam API limits or account privacy.

---

# Future improvements

Possible improvements after the hackathon:

* support for Epic Games, GOG, Xbox, and PlayStation libraries;
* AI-generated comeback explanations;
* friend-based recommendations;
* multiplayer revival suggestions;
* achievement-based progress analysis;
* notification system for discounts and updates;
* personalized “what to play tonight” mode;
* genre preference learning;
* game mood filters, such as chill, competitive, story, short session, long session.

---

# Project goal

Encore is designed to make game libraries useful again.

Instead of letting games stay forgotten, the service gives each game a second chance through a personalized Revival Queue.

The main idea:

> Your next favorite game may already be in your library.
