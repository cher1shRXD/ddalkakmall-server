import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local', override: true });

export default defineConfig({
  schema: './src/shared/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env['DB_HOST'] ?? 'localhost',
    port: Number(process.env['DB_PORT'] ?? 3306),
    user: process.env['DB_USER'] ?? 'ddalkakmall',
    password: process.env['DB_PASSWORD'] ?? 'ddalkakmall',
    database: process.env['DB_NAME'] ?? 'ddalkakmall',
  },
});
