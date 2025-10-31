import { FastifyInstance } from 'fastify';
import { ROUTES, PARAMS, HTTP } from '../constants';
import {
  register,
  getUser,
  verifyUser,
} from '../controllers/users.controller';
import { getValidatorHandler } from '../utils';
import { userSchema } from '../schemas';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: HTTP.METHODS.POST,
    url: ROUTES.SIGNUP,
    preValidation: [getValidatorHandler(userSchema)],
    handler: register,
  });

  fastify.route({
    method: HTTP.METHODS.GET,
    url: ROUTES.VERIFY_USER,
    schema: {
      params: {
        required: [PARAMS.VERIFY_USER_TOKEN],
        properties: {
          [PARAMS.VERIFY_USER_TOKEN]: { type: 'string' },
        },
      },
    },
    handler: verifyUser,
  });

  fastify.route({
    method: HTTP.METHODS.GET,
    url: ROUTES.WHOAMI,
    // onRequest: fastify.authenticate,
    handler: getUser,
  });
}
