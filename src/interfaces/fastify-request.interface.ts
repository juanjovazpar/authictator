import { FastifyRequest } from 'fastify';

export interface IFastifyRequestWithDetails extends FastifyRequest {
    requestDetails?: string;
}

export interface ILogoutQuery {
    allsessions?: boolean;
}
