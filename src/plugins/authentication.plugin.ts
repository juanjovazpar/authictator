import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

// TODO: Implement cookie session: https://github.com/fastify/fastify-jwt?tab=readme-ov-file#default-options
export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(jwt, {
    secret: process.env.JWT_ACCESS_SECRET ?? 'secret',
    sign: { expiresIn: '2h' },
  });

  fastify.decorate(
    'authenticate',
    async function (req: FastifyRequest, res: FastifyReply) {
      try {
        await req.jwtVerify();
      } catch (err) {
        res.send(err);
      }
    },
  );
});
