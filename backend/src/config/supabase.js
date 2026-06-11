const env = require("./env");

function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

module.exports = { isSupabaseConfigured };
