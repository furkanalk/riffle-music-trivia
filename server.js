import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import routes from './server/routes/index.js';
import { config } from './server/config/environments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1968;
const NODE_ENV = process.env.NODE_ENV || 'dev';
const envConfig = config[NODE_ENV] || config.dev;

// CORS configuration
if (NODE_ENV === 'dev') {
  app.use(cors());
} else {
  app.use(cors({
    origin: envConfig.corsOrigin,
    credentials: true
  }));
}

app.use(express.json());

// Environment-specific logging
app.use((req, res, next) => {
  if (envConfig.logLevel === 'debug') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  }
  next();
});

// Routes
app.use('/api', routes);

// Static files
app.use(express.static(path.resolve('./')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: NODE_ENV });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});