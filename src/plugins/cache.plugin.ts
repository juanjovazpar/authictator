import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import Redis from 'ioredis';

export default fp(async function (fastify: FastifyInstance) {
  try {
    // TODO: Make Redis an strict cache by abstracting its methods
    // to an implementation for this specific app
    const redis: Redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      username: process.env.REDIS_WRITER_USERNAME,
      password: process.env.REDIS_WRITER_PASSWORD,
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
