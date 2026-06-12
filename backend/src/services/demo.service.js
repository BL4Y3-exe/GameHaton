const DAY_MS = 24 * 60 * 60 * 1000;
const DEMO_USER_ID = "00000000-0000-4000-8000-000000000001";

const demoUserSeed = {
  id: DEMO_USER_ID,
  steam_id: null,
  display_name: "Alex Respawn",
  avatar_url: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Encore",
  is_demo: true,
};

const users = new Map();

const library = [
  game(292030, "The Witcher 3: Wild Hunt", 11340, 420, 95, ["RPG", "Adventure"], ["Story Rich", "Open World"]),
  game(1091500, "Cyberpunk 2077", 7020, 310, 92, ["RPG", "Action"], ["Open World", "Sci-fi"]),
  game(620, "Portal 2", 1260, 980, 98, ["Puzzle", "Adventure"], ["Co-op", "Funny"]),
  game(413150, "Stardew Valley", 4560, 190, 94, ["Simulation", "RPG"], ["Relaxing", "Farming"]),
  game(1174180, "Red Dead Redemption 2", 5340, 510, 96, ["Action", "Adventure"], ["Open World", "Story Rich"]),
  game(367520, "Hollow Knight", 2340, 740, 93, ["Action", "Adventure"], ["Metroidvania", "Difficult"]),
  game(1145360, "Hades", 3180, 260, 95, ["Action", "RPG"], ["Roguelike", "Great Soundtrack"]),
  game(1086940, "Baldur's Gate 3", 6120, 80, 99, ["RPG", "Strategy"], ["Choices Matter", "Party-Based"]),
  game(1245620, "ELDEN RING", 4980, 150, 98, ["Action", "RPG"], ["Souls-like", "Open World"]),
  game(105600, "Terraria", 8160, 670, 94, ["Adventure", "RPG"], ["Sandbox", "Crafting"]),
  game(400, "Portal", 480, 1200, 96, ["Puzzle", "Action"], ["Classic", "Short"]),
  game(289070, "Sid Meier's Civilization VI", 9840, 365, 91, ["Strategy", "Simulation"], ["Turn-Based", "Historical"]),
  game(381210, "Dead by Daylight", 2760, 45, 88, ["Action"], ["Multiplayer", "Horror"]),
  game(730, "Counter-Strike 2", 14520, 7, 97, ["Action"], ["Competitive", "Multiplayer"]),
];

const freeGames = [
  deal(730, "Counter-Strike 2", 0, 0, 0, "Steam", "Free to play"),
  deal(570, "Dota 2", 0, 0, 0, "Steam", "Free to play"),
  deal(1172470, "Apex Legends", 0, 0, 0, "Steam", "Free to play"),
  deal(230410, "Warframe", 0, 0, 0, "Steam", "Free to play"),
];

const sales = [
  deal(292030, "The Witcher 3: Wild Hunt", 39.99, 7.99, 80),
  deal(620, "Portal 2", 9.99, 0.99, 90),
  deal(413150, "Stardew Valley", 14.99, 9.99, 33),
  deal(367520, "Hollow Knight", 14.99, 7.49, 50),
  deal(289070, "Sid Meier's Civilization VI", 59.99, 5.99, 90),
];

function game(appid, name, playtimeMinutes, daysAgo, popularity, genres, tags) {
  return {
    appid,
    name,
    image: `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`,
    genres,
    tags,
    store_url: `https://store.steampowered.com/app/${appid}`,
    playtime_minutes: playtimeMinutes,
    playtime_hours: Number((playtimeMinutes / 60).toFixed(1)),
    last_played_at: new Date(Date.now() - daysAgo * DAY_MS).toISOString(),
    popularity,
  };
}

function deal(
  appid,
  name,
  normalPrice,
  salePrice,
  savingsPercent,
  store = "Steam",
  label = null,
) {
  return {
    appid,
    name,
    image: `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`,
    normal_price: normalPrice,
    sale_price: salePrice,
    savings_percent: savingsPercent,
    store,
    label,
    store_url: `https://store.steampowered.com/app/${appid}`,
  };
}

function getOrCreateDemoUser() {
  const existingUser = users.get(DEMO_USER_ID);

  if (existingUser) {
    return clone(existingUser);
  }

  const timestamp = new Date().toISOString();
  const user = {
    ...demoUserSeed,
    created_at: timestamp,
    updated_at: timestamp,
  };

  users.set(user.id, user);
  return clone(user);
}

function getDemoUser() {
  return getOrCreateDemoUser();
}

function getUserById(userId) {
  if (userId === DEMO_USER_ID) {
    return getOrCreateDemoUser();
  }

  const user = users.get(userId);
  return user ? clone(user) : null;
}

function getLibrary() {
  return clone(library);
}

function getFreeGames() {
  return clone(freeGames);
}

function getSales() {
  return clone(sales);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

module.exports = {
  getOrCreateDemoUser,
  getDemoUser,
  getUserById,
  getLibrary,
  getFreeGames,
  getSales,
};
