import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST, 
  port: process.env.POSTGRES_PORT || 5432,
});

// Connection test but its not necessary since we handle it in server.js initDatabase function
// Dont remove in any case we may need it later
pool.on('connect', () => {
  // console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('🔥 Unexpected error on idle client', err);
  process.exit(-1);
});

// Common query function
export const query = (text, params) => pool.query(text, params);

// Export the pool (for closing it if needed)
export default pool;