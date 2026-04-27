import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { env } from '../../env.js';
import { users } from './schema/users.js';
import { refreshTokens } from './schema/refresh-tokens.js';

const schema = { users, refreshTokens };

function createDb(pool: mysql.Pool) {
  return drizzle(pool, { schema, mode: 'default' });
}

let _db: ReturnType<typeof createDb>;

export async function connectDb(): Promise<void> {
  const pool = mysql.createPool({
    host:     env.DB_HOST,
    port:     env.DB_PORT,
    user:     env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  });
  _db = createDb(pool);
}

export function getDb(): ReturnType<typeof createDb> {
  if (!_db) throw new Error('DB not initialized');
  return _db;
}
