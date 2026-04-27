import { FastifyInstance } from 'fastify';
import { UpdateProfileRequest } from './user.dto.js';
import * as userService from './user.service.js';

export default async function userRoutes(app: FastifyInstance) {
  app.get('/users/me', { onRequest: [app.authenticate] }, async (req, reply) => {
    const user = await userService.getById(req.user.userId);
    if (!user) return reply.code(404).send({ error: 'User not found' });
    return reply.send(user);
  });

  app.patch<{ Body: UpdateProfileRequest }>(
    '/users/me/profile',
    {
      onRequest: [app.authenticate],
      schema: {
        body: {
          type: 'object',
          properties: {
            phone:         { type: 'string', pattern: '^\\d{10,11}$' },
            zipcode:       { type: 'string', maxLength: 10 },
            address:       { type: 'string', maxLength: 500 },
            addressDetail: { type: 'string', maxLength: 200 },
          },
          additionalProperties: false,
        },
      },
    },
    async (req, reply) => {
      const updated = await userService.updateProfile(req.user.userId, req.body);
      return reply.send(updated);
    },
  );
}
