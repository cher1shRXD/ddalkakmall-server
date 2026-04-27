import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

// @fastify/jwt의 user 타입을 재정의하는 올바른 방법
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: { userId: string; email: string };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(async (app: FastifyInstance) => {
  app.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify({ onlyCookie: false });
    } catch {
      // Authorization 헤더 없으면 쿠키에서 시도
      try {
        const token = req.cookies['access_token'];
        if (!token) throw new Error('No token');
        req.user = app.jwt.verify(token) as { userId: string; email: string };
      } catch {
        reply.code(401).send({ error: 'Unauthorized' });
      }
    }
  });
});
