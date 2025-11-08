import { FastifyRequest } from "fastify";

export interface IFastifyRequestWithDetails extends FastifyRequest {
    requestDetails?: any;
}

export interface ILogoutQuery { allsessions?: boolean }
