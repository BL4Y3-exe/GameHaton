const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const libraryRoutes = require("./routes/library.routes");
const recommendationsRoutes = require("./routes/recommendations.routes");
const dealsRoutes = require("./routes/deals.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/error.middleware");

const app = express();

app.disable("x-powered-by");
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/revival-queue", recommendationsRoutes);
app.use("/api", dealsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
