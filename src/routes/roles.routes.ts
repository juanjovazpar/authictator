import { FastifyInstance } from 'fastify';
import { ROUTES, HTTP } from '../constants';
import { getValidatorHandler } from '../utils';
import { roleSchema } from '../schemas';
import { create, list, update } from '../controllers/roles.controller';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: HTTP.METHODS.GET,
    url: ROUTES.ROLES,
    // onRequest: fastify.authenticate, isAdmin
    handler: list,
  });

  fastify.route({
    method: HTTP.METHODS.POST,
    url: ROUTES.ROLES,
    preValidation: [getValidatorHandler(roleSchema)],
    // onRequest: fastify.authenticate, isAdmin
    handler: create,
  });

  fastify.route({
    method: HTTP.METHODS.PUT,
    url: ROUTES.ROLE,
    preValidation: [getValidatorHandler(roleSchema)],
    // onRequest: fastify.authenticate, isAdmin
    handler: update,
  });
}
