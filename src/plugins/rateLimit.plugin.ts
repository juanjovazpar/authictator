import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import ratelimit from '@fastify/rate-limit';
import { HTTP } from '../constants';

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
        message: `You reached the ${context.max} request limit in ${context.after}. Please try again later.`,
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
    function (request, reply) {
      reply.code(404).send({ hello: 'world' });
    },
  );
});
