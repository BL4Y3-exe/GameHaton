const demoService = require("./demo.service");
const supabase = require("../config/supabase");

async function getUserById(userId) {
  const demoUser = demoService.getUserById(userId);

  if (demoUser) {
    return demoUser;
  }

  return supabase.getUserById(userId);
}

module.exports = { getUserById };
