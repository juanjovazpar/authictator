import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import {
  appendStatusToResponse,
  errorHandler,
  requestLogger,
} from '../middlewares';
import { saveRequestDetails } from '../utils/saveRequest.util';

export default fp(async function (fastify: FastifyInstance) {
  fastify.addHook('onResponse', requestLogger);
  fastify.addHook('onResponse', saveRequestDetails);
  fastify.addHook('onSend', appendStatusToResponse);
  fastify.addHook('onError', errorHandler);
});
