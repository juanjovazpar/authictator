import { FastifyRequest, FastifyReply } from 'fastify';
import speakeasy, { GeneratedSecret } from 'speakeasy';

import { HTTP } from '../constants';
import { LITERALS } from '../constants/literals';
import { IUser } from '../interfaces';
import { getUserByProperty } from '../utils';

export async function setupMFA(
  req: FastifyRequest,
  res: FastifyReply
): Promise<void> {
  const userId = req.user?.sub;
  const user: IUser | null = await getUserByProperty('_id', userId);

  if (!user) {
    res.status(HTTP.CODES.NotFound).send({ message: LITERALS.USER_NOT_FOUND });
    return;
  }

  const secret: GeneratedSecret = speakeasy.generateSecret();

  await req.server.cache.set(`mfa:${userId}`, secret.base32, 'EX', 300);

  res
    .status(HTTP.CODES.Accepted)
    .send({
      message: LITERALS.MFA_SECRET_SEND,
      payload: {
        secret: secret.otpauth_url
      }
    });
};