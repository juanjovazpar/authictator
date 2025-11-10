import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import fs from 'fs';

import { authenticate } from '../middlewares';

const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH!, 'utf8');
const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH!, 'utf8');

// TODO: Implement cookie session: https://github.com/fastify/fastify-jwt?tab=readme-ov-file#default-options
export default fp(async function (fastify: FastifyInstance) {
    await fastify.register(jwt, {
        secret: {
            private: privateKey,
            public: publicKey,
        },
        sign: { algorithm: 'RS256', expiresIn: '2h' },
    });

    /* await fastify.register(jwt, {
    secret: process.env.JWT_REFRESH_SECRET ?? 'secret',
    namespace: 'refresh',
    sign: { expiresIn: '7d' },
  }); */

    fastify.decorate('authenticate', authenticate);
});
