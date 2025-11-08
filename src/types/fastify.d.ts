import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import Redis from 'ioredis';

import { IUserToken } from '../interfaces';

declare module 'fastify' {
    interface FastifyRequest {
        user: IUserToken;
    }
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        requireAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        cache: Redis;
    }
}