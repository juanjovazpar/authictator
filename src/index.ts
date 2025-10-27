import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';
import path from 'path';

const host: string = process.env.HOST ?? '0.0.0.0';
const port: number = process.env.PORT ? Number(process.env.PORT) : 3000;

export interface AppOptions { }

const server = Fastify({ logger: true });

server.register((fastify: FastifyInstance, opts: AppOptions) => {
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: { ...opts },
    });

    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: { ...opts },
    });
});

server.listen({ port, host }, (err) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    } else {
        console.log(`[ ready ] http://${host}:${port}`);
    }
});
