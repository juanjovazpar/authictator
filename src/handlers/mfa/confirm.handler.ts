import { FastifyRequest, FastifyReply } from 'fastify';
import speakeasy from 'speakeasy';

import { HTTP, LITERALS } from '../../constants';
import { IUser } from '../../interfaces';
import { getUserByProperty } from '../../utils';
import { TMFACodeInput } from '../../schemas';

export async function confirmMFASecret(
  req: FastifyRequest<{ Body: TMFACodeInput }>,
  res: FastifyReply,
): Promise<void> {
  const { token } = req.body;
  const userId: string = req.user?.sub;
  const secret = await req.cache.getMFA(userId);

  if (!secret) {
    res.status(HTTP.CODES.NotFound).send({ message: LITERALS.MFA_SECRET_EXPIRED });
    return;
  }

  const verified: boolean = speakeasy.totp.verify({
    encoding: 'base32',
    secret,
    token,
  });

  if (!verified) {
    res.status(HTTP.CODES.BadRequest).send({ message: LITERALS.MFA_SETUP_UNSUCCESSFULL });
    return;
  }

  const user: IUser | null = await getUserByProperty('_id', userId);

  if (!user) {
    res.status(HTTP.CODES.NotFound).send({ message: LITERALS.USER_NOT_FOUND });
    return;
  }

  // TODO: Encrypt secret before saving to DB
  user.mfaSecret = secret;
  await user.save();

  res.status(HTTP.CODES.Accepted).send({
    message: LITERALS.MFA_SETUP_SUCCESSFULLY,
  });

  req.cache.delMFA(userId);
}
