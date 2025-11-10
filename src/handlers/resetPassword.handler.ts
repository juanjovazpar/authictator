import { FastifyRequest, FastifyReply } from 'fastify';

import { HTTP, PARAMS } from '../constants';
import { LITERALS } from '../constants/literals';
import { comparePasswords, hashPassword } from '../utils';
import { IUser } from '../interfaces';
import { getUserByProperty } from '../utils';
import { TPasswordInput } from '../schemas';

export const resetPassword = async (
  req: FastifyRequest<{ Body: TPasswordInput }>,
  res: FastifyReply,
): Promise<Response | void> => {
  const { password } = req.body;
  const { [PARAMS.FORGOT_PASSWORD_TOKEN]: resetPasswordToken } = req.params as {
    [PARAMS.FORGOT_PASSWORD_TOKEN]: string;
  };
  const user: IUser | null = await getUserByProperty('resetPasswordToken', resetPasswordToken);

  const passwordMatch: boolean = await comparePasswords(password, user.password);

  if (passwordMatch) {
    res.send(HTTP.CODES.BadRequest).send({ message: LITERALS.USED_PASSWORD_ERROR });
    return;
  }

  const hashedPassword = await hashPassword(password);

  user.resetPasswordToken = undefined;
  user.password = hashedPassword;
  await user.save();

  res.status(HTTP.CODES.Accepted).send({ message: LITERALS.PASSWORD_RESET });

  // TODO: Implement send password set mail
  // await sendPasswordSetMail(user.email);
};
