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
    res.log.info('Error appending status to response:');
    res.log.error(error);
    return payload;
  }
};
