import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mongoose from 'mongoose';

export default fp(async function (fastify: FastifyInstance) {
    try {
        mongoose.connect(
            `${process.env.DATABASE_URL || 'mongodb://localhost:27017/authictator'}`,
        );
        fastify.log.info('Connected to MongoDB');
    } catch {
        fastify.log.error('Error connecting to MongoDB');
    }
});
