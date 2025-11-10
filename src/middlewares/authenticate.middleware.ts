import { IUserToken } from '../interfaces';
import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP, LITERALS } from '../constants';

export const authenticate = async function (req: FastifyRequest, res: FastifyReply) {
  try {
    const user: IUserToken = await req.jwtVerify();
    const exists: number = await req.cache.isSessionActive(user.jwti, user.sub);

    if (!exists) {
      return res.status(HTTP.CODES.Unauthorized).send({ message: LITERALS.TOKEN_REVOKED });
    }
  } catch (err) {
    res.send(err);
  }
};
