import { FastifyInstance } from 'fastify';

import { ROUTES, HTTP } from '../constants';
import { setupMFA } from '../handlers/setupMfa.handler';
import { confirmMFA } from '../handlers/confirmMfa.handler';
import { getValidatorHandler } from '../utils';
import { userMFACodeSchema } from '../schemas';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: HTTP.METHODS.GET,
    url: ROUTES.MFA,
    onRequest: fastify.authenticate,
    handler: setupMFA,
  });

  fastify.route({
    method: HTTP.METHODS.POST,
    url: ROUTES.MFA,
    preValidation: [getValidatorHandler(userMFACodeSchema)],
    onRequest: fastify.authenticate,
    handler: confirmMFA,
  });
}
