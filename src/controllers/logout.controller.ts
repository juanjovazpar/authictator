import { FastifyRequest, FastifyReply } from 'fastify';

import { HTTP } from '../constants';
import { ILogoutQuery } from '../interfaces';
import { LITERALS } from '../constants/literals';

export const logout = async function (
  req: FastifyRequest<{ Querystring: ILogoutQuery }>,
  res: FastifyReply,
): Promise<Response | void> {
  const { allsessions } = req.query;
  const { sub, jwti } = req.user;

  if (!sub || !jwti) {
    res.status(HTTP.CODES.Unauthorized).send({
      message: LITERALS.USER_NOT_FOUND,
    });
    return;
  }

  if (allsessions) {
    const keys: string[] = await req.server.cache.keys(`sessions:${sub}:*`);
    if (keys.length) await req.server.cache.del(...keys);
  } else {
    await req.server.cache.del(`sessions:${sub}:${jwti}`);
  }

  res.status(HTTP.CODES.Accepted).send({
    message: LITERALS.USER_LOGOUT,
  });
};

