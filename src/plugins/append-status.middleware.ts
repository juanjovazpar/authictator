import { FastifyRequest, FastifyReply } from 'fastify';

export const appendStatusToResponse = async (
  _: FastifyRequest,
  res: FastifyReply,
  payload: string,
) => {
  try {
    const responseBody = JSON.parse(payload);
    responseBody.statusCode = res.statusCode;
    return JSON.stringify(responseBody);
  } catch (error: unknown) {
    return payload;
  }
};
