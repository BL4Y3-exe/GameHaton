const demoService = require("./demo.service");

function getFreeGames() {
  return demoService.getFreeGames();
}

function getSales() {
  return demoService.getSales();
}

module.exports = { getFreeGames, getSales };
