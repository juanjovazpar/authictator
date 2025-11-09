import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import {
  appendStatusToResponse,
  errorHandler,
  requestLogger,
  saveRequestDetails
} from '../middlewares';

export default fp(async function (fastify: FastifyInstance) {
  // Conver middlewares to plugins
  fastify.addHook('onResponse', requestLogger);
  fastify.addHook('onResponse', saveRequestDetails);
  fastify.addHook('onSend', appendStatusToResponse);
  fastify.addHook('onError', errorHandler);
});
