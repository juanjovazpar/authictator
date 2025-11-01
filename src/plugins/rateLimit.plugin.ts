import { sprintf } from 'sprintf-js';

import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import ratelimit from '@fastify/rate-limit';
import { HTTP } from '../constants';
import { LITERALS } from '../constants/literals';

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(ratelimit, {
    max: 1000,
    ban: 1,
    timeWindow: '1 minute',
    allowList: [], // TODO: Add IPs to allow list from cluster pods
    errorResponseBuilder: (_, context) => {
      return {
        statusCode: HTTP.CODES.TooManyRequests,
        error: 'Too Many Requests',
        message: sprintf(LITERALS.LIMIT_REACHED, context.max, context.after)
      };
    },
  });

  // Prevent guessing routes by brute-forcing notFound
  fastify.setNotFoundHandler(
    {
      preHandler: fastify.rateLimit({
        max: 4,
        timeWindow: '1 minute',
      }),
    },
    function (_, reply) {
      reply.code(404).send({ hello: 'world' });
    },
  );
});
