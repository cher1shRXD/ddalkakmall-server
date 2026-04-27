import { FastifyInstance, FastifyReply } from 'fastify';
import {
  fetchGoogleProfile,
  handleGoogleCallback,
  rotateTokens,
  logout,
} from './auth.service.js';
import { env } from '../env.js';

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'lax',
  path: '/',
} as const;

function setTokenCookies(reply: FastifyReply, accessToken: string, refreshToken: string) {
  reply
    .setCookie('access_token', accessToken, { ...COOKIE_BASE, maxAge: 60 * 60 })
    .setCookie('refresh_token', refreshToken, { ...COOKIE_BASE, maxAge: 60 * 60 * 24 * 7 });
}

export default async function authRoutes(app: FastifyInstance) {
  app.get('/auth', async (req, reply) => {
    const uri = await app.googleOAuth2.generateAuthorizationUri(req, reply);
    return reply.redirect(uri);
  });

  app.get('/auth/callback', async (req, reply) => {
    try {
      const tokenRes = await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
      const googleToken = (tokenRes.token as { access_token: string }).access_token;

      const profile = await fetchGoogleProfile(googleToken);
      const { tokens } = await handleGoogleCallback(app, profile);

      setTokenCookies(reply, tokens.accessToken, tokens.refreshToken);
      return reply.redirect(env.FRONTEND_URL);
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'OAuth callback failed' });
    }
  });

  app.post('/auth/refresh', async (req, reply) => {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) return reply.code(401).send({ error: 'No refresh token' });

    try {
      const tokens = await rotateTokens(app, refreshToken);

      setTokenCookies(reply, tokens.accessToken, tokens.refreshToken);
      return reply.send({ ok: true });
    } catch {
      return reply.code(401).send({ error: 'Invalid or expired refresh token' });
    }
  });

  app.post('/auth/logout', async (req, reply) => {
    const refreshToken = req.cookies['refresh_token'];
    if (refreshToken) await logout(refreshToken);

    reply
      .clearCookie('access_token', { path: '/' })
      .clearCookie('refresh_token', { path: '/' });

    return reply.send({ ok: true });
  });
}
