import { HTTP } from '../constants';
import { FastifyInstance } from 'fastify';
import { LITERALS } from '../constants/literals';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: HTTP.METHODS.GET,
    url: '/',
    handler: async () => ({
      message: LITERALS.HEY_THERE,
    }),
  });
}
