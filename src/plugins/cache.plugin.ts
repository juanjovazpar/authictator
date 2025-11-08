import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import Redis from 'ioredis';

export default fp(async function (fastify: FastifyInstance) {
  // TODO: Define writer and reader users for Redis cache
  try {
    const redis: Redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });

    fastify.decorate(
      'cache',
      redis,
    );
  } catch (err) {
    // TODO: Abstract logger
    console.log('Setting up redis cache:', err);
  }
});
