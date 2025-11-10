import { FastifyInstance } from 'fastify';
import { ROUTES, HTTP } from '../constants';
import { loginSchema, mfaLoginSchema } from '../schemas';
import { getValidatorHandler } from '../utils/validatorHandler.util';
import { mfaSignin, signin } from '../handlers/sessions/sigin.handler';
import { logout } from '../handlers/sessions/logout.handler';

export default async function (fastify: FastifyInstance) {
    fastify.route({
        method: HTTP.METHODS.POST,
        url: ROUTES.SIGNIN,
        preValidation: [getValidatorHandler(loginSchema)],
        handler: signin,
    });

    fastify.route({
        method: HTTP.METHODS.POST,
        url: ROUTES.SIGNIN_MFA,
        preValidation: [getValidatorHandler(mfaLoginSchema)],
        handler: mfaSignin,
    });

    fastify.route({
        method: HTTP.METHODS.GET,
        url: ROUTES.LOGOUT,
        onRequest: fastify.authenticate,
        handler: logout,
    });
}
