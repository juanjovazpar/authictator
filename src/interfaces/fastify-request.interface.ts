import { FastifyRequest } from "fastify";

export interface FastifyRequestWithDetails extends FastifyRequest {
    requestDetails?: any;
}