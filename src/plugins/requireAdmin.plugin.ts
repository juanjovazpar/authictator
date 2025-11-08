import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { IUserToken } from '../interfaces';
import { HTTP, LITERALS } from '../constants';

const adminRoleName = process.env.ADMIN_ROLE_NAME || 'admin';

export default fp(async function (fastify: FastifyInstance) {
  fastify.decorate(
    'requireAdmin',
    async function (req: FastifyRequest, res: FastifyReply) {
      try {
        const { roles } = await req.jwtVerify() as IUserToken;

        if (!roles.includes(adminRoleName)) {
          return res.status(HTTP.CODES.Forbidden).send({ message: LITERALS.ADMIN_ROLE_REQUIRED });
        }
      } catch (err) {
        res.send(err);
      }
    },
  );
});
