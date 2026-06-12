const app = require("./app");
const env = require("./config/env");

const server = app.listen(env.port, "0.0.0.0", () => {
  console.log(
    `Encore API listening on ${env.backendUrl} in ${env.nodeEnv} mode`,
  );
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
