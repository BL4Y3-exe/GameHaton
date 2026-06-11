const DAY_MS = 24 * 60 * 60 * 1000;

const demoUser = {
  id: "demo-user-001",
  steam_id: null,
  display_name: "Alex Respawn",
  avatar_url: "https://api.dicebear.com/9.x/pixel-art/svg?seed=GameHaton",
  is_demo: true,
  created_at: "2026-01-15T10:00:00.000Z",
  updated_at: "2026-06-01T10:00:00.000Z",
};

const library = [
  game(292030, "The Witcher 3: Wild Hunt", 11340, 420, 95, ["RPG"], ["Story Rich"]),
  game(1091500, "Cyberpunk 2077", 7020, 310, 92, ["RPG"], ["Open World"]),
  game(620, "Portal 2", 1260, 980, 98, ["Puzzle"], ["Co-op"]),
  game(413150, "Stardew Valley", 4560, 190, 94, ["Simulation"], ["Relaxing"]),
  game(1174180, "Red Dead Redemption 2", 5340, 510, 96, ["Action"], ["Open World"]),
  game(367520, "Hollow Knight", 2340, 740, 93, ["Action"], ["Metroidvania"]),
  game(1145360, "Hades", 3180, 260, 95, ["Action"], ["Roguelike"]),
  game(1086940, "Baldur's Gate 3", 6120, 80, 99, ["RPG"], ["Choices Matter"]),
  game(1245620, "ELDEN RING", 4980, 150, 98, ["Action"], ["Souls-like"]),
  game(105600, "Terraria", 8160, 670, 94, ["Adventure"], ["Sandbox"]),
  game(400, "Portal", 480, 1200, 96, ["Puzzle"], ["Classic"]),
  game(289070, "Sid Meier's Civilization VI", 9840, 365, 91, ["Strategy"], ["Turn-Based"]),
  game(381210, "Dead by Daylight", 2760, 45, 88, ["Action"], ["Multiplayer"]),
  game(730, "Counter-Strike 2", 14520, 7, 97, ["Action"], ["Competitive"]),
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

function getDemoUser() {
  return { ...demoUser };
}

function getUserById(userId) {
  return userId === demoUser.id ? getDemoUser() : null;
}

function getLibrary() {
  return library.map((item) => ({ ...item }));
}

function getFreeGames() {
  return freeGames.map((item) => ({ ...item }));
}

function getSales() {
  return sales.map((item) => ({ ...item }));
}

module.exports = {
  getDemoUser,
  getUserById,
  getLibrary,
  getFreeGames,
  getSales,
};
