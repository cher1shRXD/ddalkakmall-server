import { FastifyInstance } from 'fastify';
import { CreateBrandRequest } from './brand.dto.js';
import * as brandService from './brand.service.js';

export default async function brandRoutes(app: FastifyInstance) {
  app.get('/brands', { onRequest: [app.authenticate] }, async (req, reply) => {
    const brands = await brandService.getMyBrands(req.user.userId);
    return reply.send(brands);
  });

  app.get<{ Params: { id: string } }>(
    '/brands/:id',
    { onRequest: [app.authenticate] },
    async (req, reply) => {
      const brand = await brandService.getMyBrand(req.params.id, req.user.userId);
      if (!brand) return reply.code(404).send({ error: 'Brand not found' });
      return reply.send(brand);
    },
  );

  app.post<{ Body: CreateBrandRequest }>(
    '/brands',
    {
      onRequest: [app.authenticate],
      schema: {
        body: {
          type: 'object',
          required: ['name', 'phone'],
          properties: {
            name:  { type: 'string', minLength: 1, maxLength: 100 },
            phone: { type: 'string', pattern: '^\\d{10,11}$' },
          },
          additionalProperties: false,
        },
      },
    },
    async (req, reply) => {
      const brand = await brandService.createBrand(req.user.userId, req.body);
      return reply.code(201).send(brand);
    },
  );
}
