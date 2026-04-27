import Fastify from 'fastify';
import fjwt from '@fastify/jwt';
import oauth2, { OAuth2Namespace } from '@fastify/oauth2';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import { env } from './env.js';
import { connectDb } from './shared/db/connection.js';
import { connectRedis, disconnectRedis } from './shared/redis/connection.js';
import authPlugin from './plugins/auth.plugin.js';
import authRoutes from './auth/auth.route.js';
import userRoutes from './user/user.route.js';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

// oauth2의 export = 패턴이 NodeNext에서 타입 미인식되므로 직접 정의
const GOOGLE_CONFIGURATION = {
  authorizeHost: 'https://accounts.google.com',
  authorizePath: '/o/oauth2/v2/auth',
  tokenHost:     'https://www.googleapis.com',
  tokenPath:     '/oauth2/v4/token',
};

const app = Fastify({ logger: true });

async function bootstrap() {
  await connectDb();
  await connectRedis();

  await app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true, // 쿠키 전송 허용
  });
  await app.register(cookie);
  await app.register(fjwt, { secret: env.JWT_SECRET });
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  await app.register(oauth2, {
    name: 'googleOAuth2',
    scope: ['profile', 'email'],
    credentials: {
      client: { id: env.GOOGLE_CLIENT_ID, secret: env.GOOGLE_CLIENT_SECRET },
      auth: GOOGLE_CONFIGURATION,
    },
    callbackUri: env.GOOGLE_CALLBACK_URL,
  });

  await app.register(authPlugin);
  await app.register(authRoutes);
  await app.register(userRoutes);

  app.get('/health', async () => ({ status: 'ok' }));

  await app.listen({ port: env.PORT, host: '0.0.0.0' });

  const shutdown = async () => {
    await app.close();
    await disconnectRedis();
    process.exit(0);
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
