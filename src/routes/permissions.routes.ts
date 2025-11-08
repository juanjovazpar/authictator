import { FastifyInstance } from 'fastify';
import { ROUTES, HTTP } from '../constants';
import { getValidatorHandler } from '../utils';
import { permissionSchema } from '../schemas';
import { create, list, update, remove } from '../controllers/permissions.controller';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: HTTP.METHODS.GET,
    url: ROUTES.PERMISSIONS,
    onRequest: [fastify.authenticate, fastify.requireAdmin],
    handler: list,
  });

  fastify.route({
    method: HTTP.METHODS.POST,
    url: ROUTES.PERMISSIONS,
    preValidation: [getValidatorHandler(permissionSchema)],
    onRequest: [fastify.authenticate, fastify.requireAdmin],
    handler: create,
  });

  fastify.route({
    method: HTTP.METHODS.PUT,
    url: ROUTES.PERMISSION,
    preValidation: [getValidatorHandler(permissionSchema)],
    onRequest: [fastify.authenticate, fastify.requireAdmin],
    handler: update,
  });

  fastify.route({
    method: HTTP.METHODS.DELETE,
    url: ROUTES.PERMISSION,
    onRequest: [fastify.authenticate, fastify.requireAdmin],
    handler: remove,
  });
}
