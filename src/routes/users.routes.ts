import { FastifyInstance } from 'fastify';

import { ROUTES, PARAMS, HTTP } from '../constants';
import { getValidatorHandler } from '../utils';
import { userSchema } from '../schemas';
import { whoami } from '../handlers/users/whoami.handler';
import { register } from '../handlers/users/register.handler';
import { verify } from '../handlers/users/verify.handler';

const FREE_SIGNUP = process.env.FREE_SIGNUP || false;

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: HTTP.METHODS.POST,
    url: ROUTES.SIGNUP,
    preValidation: [getValidatorHandler(userSchema)],
    handler: register,
    onRequest: FREE_SIGNUP ? undefined : fastify.authenticate
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
    handler: verify,
  });

  fastify.route({
    method: HTTP.METHODS.GET,
    url: ROUTES.WHOAMI,
    onRequest: fastify.authenticate,
    handler: whoami,
  });
}
