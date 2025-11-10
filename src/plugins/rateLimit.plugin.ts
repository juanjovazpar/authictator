import { sprintf } from 'sprintf-js';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import ratelimit from '@fastify/rate-limit';

import { HTTP } from '../constants';
import { LITERALS } from '../constants/literals';

const RATE_LIMIT_MAX: number = Number(process.env.RATE_LIMIT_MAX) || 1000;
const timeWindow: string = '1 minute';

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(ratelimit, {
    max: RATE_LIMIT_MAX,
    ban: 1,
    timeWindow,
    allowList: [],
    errorResponseBuilder: (_, context) => {
      return {
        statusCode: HTTP.CODES.TooManyRequests,
        error: LITERALS.TOO_MANY_REQUESTS,
        message: sprintf(LITERALS.LIMIT_REACHED, context.max, context.after),
      };
    },
  });

  // Prevent guessing routes by brute-forcing notFound
  fastify.setNotFoundHandler(
    {
      preHandler: fastify.rateLimit({
        max: 4,
        timeWindow,
      }),
    },
    function (_, reply) {
      reply.code(HTTP.CODES.NotFound).send({ message: 'Hello there!' });
    },
  );
});
