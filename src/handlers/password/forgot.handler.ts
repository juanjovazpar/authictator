import { FastifyRequest, FastifyReply } from 'fastify';

import { HTTP } from '../../constants';
import { LITERALS } from '../../constants/literals';
import { getHashedToken } from '../../utils';
import { IUser } from '../../interfaces';
import { User } from '../../models';
import { TEmailInput } from '../../schemas';

export const forgot = async (
  req: FastifyRequest<{ Body: TEmailInput }>,
  res: FastifyReply,
): Promise<Response | void> => {
  const { email } = req.body;
  const resetPasswordToken = await getHashedToken(60 * 60 * 1000);
  const user: IUser | null = await User.findOneAndUpdate(
    { email },
    {
      $set: { resetPasswordToken },
    },
    { new: true },
  );

  if (!user) {
    res.status(HTTP.CODES.NotFound).send({ message: LITERALS.USER_NOT_FOUND });
    return;
  }

  // TODO: Check if MFA is activated - Mandatory for Admins

  res.status(HTTP.CODES.Accepted).send({ message: LITERALS.RESET_PASSWORD_SENT });

  // TODO: Implement send reset password mail
  // await sendResetPasswordMail(user.email, hashedResetPasswordToken);
};
