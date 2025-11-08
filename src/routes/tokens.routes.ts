import { FastifyInstance } from 'fastify';
import { ROUTES, HTTP } from '../constants';
import { logout, signin } from '../controllers/tokens.controller';
import { loginSchema } from '../schemas/user.schema';
import { getValidatorHandler } from '../utils/validatorHandler.util';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: HTTP.METHODS.POST,
    url: ROUTES.SIGNIN,
    preValidation: [getValidatorHandler(loginSchema)],
    handler: signin,
  });

  fastify.route({
    method: HTTP.METHODS.GET,
    url: ROUTES.LOGOUT,
    onRequest: fastify.authenticate,
    handler: logout,
  });
}
