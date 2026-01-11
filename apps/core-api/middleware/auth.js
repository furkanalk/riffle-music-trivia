// TODO: Implement authentication middleware
import { validateApiKey } from "../config/environments.js";

export const authenticate = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const environment = process.env.NODE_ENV || "dev";

  if (!apiKey) {
    return res.status(401).json({ error: "API key required" });
  }

  if (!validateApiKey(apiKey, environment)) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
};
