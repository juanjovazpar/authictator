import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { requireAdmin } from '../middlewares/requireAdmin.middleware';

export default fp(async function (fastify: FastifyInstance) {
    fastify.decorate('requireAdmin', requireAdmin);
});
