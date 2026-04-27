import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local', override: true });

const required = (key: string) => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env: ${key}`);
  return val;
};

export const env = {
  PORT: Number(process.env['PORT'] ?? 3000),
  JWT_SECRET: required('JWT_SECRET'),

  GOOGLE_CLIENT_ID:     required('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: required('GOOGLE_CLIENT_SECRET'),
  REDIS_URL:            process.env['REDIS_URL'] ?? 'redis://localhost:6379',

  GOOGLE_CALLBACK_URL:  process.env['GOOGLE_CALLBACK_URL'] ?? 'http://localhost:8080/auth/callback',
  FRONTEND_URL:         process.env['FRONTEND_URL'] ?? 'http://localhost:3000',

  DB_HOST:     process.env['DB_HOST'] ?? 'localhost',
  DB_PORT:     Number(process.env['DB_PORT'] ?? 3306),
  DB_USER:     required('DB_USER'),
  DB_PASSWORD: required('DB_PASSWORD'),
  DB_NAME:     required('DB_NAME'),
};
