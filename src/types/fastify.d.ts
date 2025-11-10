/* eslint-disable no-unused-vars */
import { FastifyReply } from 'fastify';

import { IRedisCache, IUserToken } from '../interfaces';

declare module 'fastify' {
  interface FastifyRequest {
    user: IUserToken;
    cache: IRedisCache;
  }
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    sendEmail: (to: string, subject: string, text: string) => Promise<void>;
    cache: ICache;
  }
}
