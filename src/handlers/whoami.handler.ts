import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP } from '../constants';
import { IUser } from '../interfaces';
import { getUserByProperty } from '../utils/findUser.utils';
import { LITERALS } from '../constants/literals';

export async function whoami(req: FastifyRequest, res: FastifyReply): Promise<void> {
  const userId = req.user?.sub;
  const user: IUser | null = await getUserByProperty('_id', userId);

  if (!user) {
    res.status(HTTP.CODES.NotFound).send({ message: LITERALS.USER_NOT_FOUND });
    return;
  }

  res.status(HTTP.CODES.Accepted).send({ payload: user });
}
