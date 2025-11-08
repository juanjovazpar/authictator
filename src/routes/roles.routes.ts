import { FastifyInstance } from 'fastify';
import { ROUTES, HTTP } from '../constants';
import { getValidatorHandler } from '../utils';
import { roleSchema } from '../schemas';
import { create, list, update, remove } from '../controllers/roles.controller';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: HTTP.METHODS.GET,
    url: ROUTES.ROLES,
    onRequest: [fastify.authenticate, fastify.requireAdmin],
    handler: list,
  });

  fastify.route({
    method: HTTP.METHODS.POST,
    url: ROUTES.ROLES,
    preValidation: [getValidatorHandler(roleSchema)],
    onRequest: [fastify.authenticate, fastify.requireAdmin],
    handler: create,
  });

  fastify.route({
    method: HTTP.METHODS.PUT,
    url: ROUTES.ROLE,
    preValidation: [getValidatorHandler(roleSchema)],
    onRequest: [fastify.authenticate, fastify.requireAdmin],
    handler: update,
  });

  fastify.route({
    method: HTTP.METHODS.DELETE,
    url: ROUTES.ROLE,
    onRequest: [fastify.authenticate, fastify.requireAdmin],
    handler: remove,
  });
}
