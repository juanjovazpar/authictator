import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mongoose from 'mongoose';

export default fp(async function (fastify: FastifyInstance) {
  mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/authicator')
    .then(() => {
      fastify.log.info('Connected to MongoDB');
    })
    .catch((error) => {
      fastify.log.info('Error connecting to MongoDB:', error);
    });
});
