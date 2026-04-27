import { Redis } from 'ioredis';
import { env } from '../../env.js';

let _redis: Redis;

export function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis(env.REDIS_URL, { lazyConnect: true });
    _redis.on('error', (err: Error) => console.error('[Redis]', err.message));
  }
  return _redis;
}

export async function connectRedis(): Promise<void> {
  await getRedis().connect();
  console.log('[Redis] connected');
}

export async function disconnectRedis(): Promise<void> {
  await _redis?.quit();
}
