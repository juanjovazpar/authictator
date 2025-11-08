import { HTTP, ROUTES } from '../constants';
import { FastifyInstance } from 'fastify';
import { LITERALS } from '../constants/literals';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: HTTP.METHODS.GET,
    url: ROUTES.HEALTHZ,
    handler: async () => ({
      message: LITERALS.HEY_THERE,
    }),
  });
}
