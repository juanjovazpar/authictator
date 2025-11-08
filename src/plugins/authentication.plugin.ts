import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { IUserToken } from '../interfaces';
import { HTTP, LITERALS } from '../constants';

// TODO: Implement cookie session: https://github.com/fastify/fastify-jwt?tab=readme-ov-file#default-options
export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(jwt, {
    secret: process.env.JWT_ACCESS_SECRET ?? 'secret',
    sign: { expiresIn: '2h' },
  });

  await fastify.register(jwt, {
    secret: process.env.JWT_REFRESH_SECRET ?? 'secret',
    namespace: 'refresh',
    sign: { expiresIn: '7d' },
  });

  fastify.decorate(
    'authenticate',
    async function (req: FastifyRequest, res: FastifyReply) {
      try {
        const user: IUserToken = await req.jwtVerify();
        const cacheKey: string = `sessions:${user.sub}:${user.jwti}`;
        const exists: number = await fastify.cache.exists(cacheKey);

        if (!exists) {
          return res.status(HTTP.CODES.Unauthorized).send({ message: LITERALS.TOKEN_REVOKED });
        }
      } catch (err) {
        res.send(err);
      }
    },
  );
});
