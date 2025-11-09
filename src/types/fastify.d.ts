import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import Redis from 'ioredis';

import { IRedisCache, IUserToken } from '../interfaces';
import { cache } from './cache';

declare module 'fastify' {
    interface FastifyRequest {
        user: IUserToken;
        cache: IRedisCache;
    }
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        requireAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        cache: ICache;
    }
}