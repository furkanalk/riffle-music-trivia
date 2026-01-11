import cors from "cors";
import express from "express";
import { config, validateApiKey } from "./config/environments.js";
import { initDatabase } from "./models/init.js";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Determine the environment (Default: dev)
const NODE_ENV = process.env.NODE_ENV || "dev";
const currentConfig = config[NODE_ENV];

console.log(`Starting Riffle API`);
console.log(`Environment: [${NODE_ENV}]`);
console.log(`Log Level: ${currentConfig.logLevel}`);

// CORS Configuration
app.use(
  cors({
    origin: currentConfig.corsOrigin,
  })
);

app.use(express.json());

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || !validateApiKey(apiKey, NODE_ENV)) {
    return res.status(401).json({ error: "Unauthorized: Invalid or missing API Key" });
  }

  next();
};

// Routes
app.get("/", (_req, res) => {
  res.json({ message: "Riffle API is running", env: NODE_ENV });
});

app.get("/secure-data", authMiddleware, (_req, res) => {
  res.json({
    data: "Secure data accessed successfully.",
    context: "This endpoint is protected by API Key validation.",
  });
});

app.use("/api", routes);

// Initialize Database
initDatabase().then(() => {
  console.log("📊 Database ready for action");
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  if (NODE_ENV === "dev") {
    console.log(`Dev API Key (Auto-Generated): ${currentConfig.apiKey}`);
  }
});

// Health Check Endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
