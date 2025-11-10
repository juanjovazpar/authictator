import { FastifyInstance } from 'fastify';

import { ROUTES, PARAMS, HTTP } from '../constants';
import { emailSchema, passwordSchema } from '../schemas/user.schema';
import { getValidatorHandler } from '../utils/validatorHandler.util';
import { forgot } from '../handlers/password/forgot.handler';
import { reset } from '../handlers/password/reset';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: HTTP.METHODS.POST,
    url: ROUTES.REQUEST_FORGOT_PASSWORD,
    preValidation: [getValidatorHandler(emailSchema)],
    handler: forgot,
  });

  fastify.route({
    method: HTTP.METHODS.POST,
    url: ROUTES.SET_PASSWORD,
    schema: {
      params: {
        required: [PARAMS.FORGOT_PASSWORD_TOKEN],
        properties: {
          [PARAMS.FORGOT_PASSWORD_TOKEN]: { type: 'string' },
        },
      },
    },
    preValidation: [getValidatorHandler(passwordSchema)],
    handler: reset,
  });
}
