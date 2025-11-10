import { FastifyInstance } from 'fastify';

import { ROUTES, HTTP } from '../constants';
import { requestMFASecret } from '../handlers/mfa/setup';
import { confirmMFASecret } from '../handlers/mfa/confirm.handler';
import { getValidatorHandler } from '../utils';
import { userMFACodeSchema } from '../schemas';

export default async function (fastify: FastifyInstance) {
    fastify.route({
        method: HTTP.METHODS.GET,
        url: ROUTES.MFA,
        onRequest: fastify.authenticate,
        handler: requestMFASecret,
    });

    fastify.route({
        method: HTTP.METHODS.POST,
        url: ROUTES.MFA,
        preValidation: [getValidatorHandler(userMFACodeSchema)],
        onRequest: fastify.authenticate,
        handler: confirmMFASecret,
    });
}
