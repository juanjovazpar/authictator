import { FastifyInstance } from 'fastify';
import { ROUTES, HTTP } from '../constants';
import { signin } from '../controllers/tokens.controller';
import { loginSchema } from '../schemas/user.schema';
import { getValidatorHandler } from '../utils/validatorHandler.util';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: HTTP.METHODS.POST,
    url: ROUTES.SIGNIN,
    schema: {
      body: {
        type: 'object',
        required: ['password', 'email'],
      },
    },
    preValidation: [getValidatorHandler(loginSchema)],
    handler: signin,
  });
}
