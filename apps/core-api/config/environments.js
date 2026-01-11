import crypto from "node:crypto";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve("./config/.env") });

export const config = {
  dev: {
    corsOrigin: "*",
    logLevel: "debug",
    apiKey: process.env.RIFFLE_DEV_API_KEY || generateApiKey("dev"),
    databaseUrl: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/riffle_dev",
  },
  test: {
    corsOrigin: "http://localhost:1968",
    logLevel: "warn",
    apiKey: process.env.RIFFLE_TEST_API_KEY || generateApiKey("test"),
    databaseUrl:
      process.env.TEST_DATABASE_URL || "postgresql://user:password@localhost:5432/riffle_test",
  },
  stage: {
    corsOrigin: process.env.STAGE_ORIGIN || "https://stage.riffle.com",
    logLevel: "info",
    apiKey: process.env.RIFFLE_STAGE_API_KEY || generateApiKey("stage"),
    databaseUrl: process.env.STAGE_DATABASE_URL,
  },
  prod: {
    corsOrigin: process.env.PROD_ORIGIN || "https://riffle.com",
    logLevel: "error",
    apiKey: process.env.RIFFLE_PROD_API_KEY || generateApiKey("prod"),
    databaseUrl: process.env.PROD_DATABASE_URL,
  },
};

// Generates a deterministic API key based on the environment name.
function generateApiKey(env) {
  const secret = `riffle-${env}-secret-key`;
  return crypto.createHash("sha256").update(secret).digest("hex").substring(0, 32);
}

// Validates the provided API key against the environment configuration.
export function validateApiKey(providedKey, environment) {
  const envConfig = config[environment];

  if (!envConfig || !providedKey) return false;

  const providedBuffer = Buffer.from(providedKey, "hex");
  const actualBuffer = Buffer.from(envConfig.apiKey, "hex");

  if (providedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, actualBuffer);
}
