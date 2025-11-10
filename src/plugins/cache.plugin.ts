import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { cache } from '../utils';

export default fp(async function (fastify: FastifyInstance) {
  try {
    fastify.decorate('cache', cache);
    fastify.decorateRequest('cache', {
      getter() {
        return fastify.cache;
      },
    });
  } catch (error) {
    fastify.log.info('Setting up cache:');
    fastify.log.error(error);
  }
});
