import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or POSTGRES_URL environment variable is required');
}

const shouldUseSsl =
  process.env.PGSSLMODE !== 'disable' && !connectionString.includes('localhost');

const pool =
  globalThis.__pgPool ||
  new Pool({
    connectionString,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000
  });

if (!globalThis.__pgPool) {
  globalThis.__pgPool = pool;
}

export function query(text, params = []) {
  return pool.query(text, params);
}

export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
