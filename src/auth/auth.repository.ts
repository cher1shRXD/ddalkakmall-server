import { createHash } from 'node:crypto';
import { getRedis } from '../shared/redis/connection.js';

const REFRESH_TTL_SEC = 60 * 60 * 24 * 7;
const key = (hash: string) => `refresh:${hash}`;

function hash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function saveRefreshToken(userId: string, token: string): Promise<void> {
  await getRedis().set(key(hash(token)), userId, 'EX', REFRESH_TTL_SEC);
}

export async function resolveRefreshToken(token: string): Promise<string | null> {
  return getRedis().get(key(hash(token)));
}

export async function deleteRefreshToken(token: string): Promise<void> {
  await getRedis().del(key(hash(token)));
}
