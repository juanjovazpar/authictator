import { FastifyRequest, FastifyReply } from 'fastify';

import { HTTP, PARAMS } from '../constants';
import { LITERALS } from '../constants/literals';

import {
  comparePasswords,
  getHashedToken,
  hashPassword,
} from '../utils';
import { IUser } from '../interfaces';
import { User } from '../models';
import { getUserByProperty } from '../utils';
import { TEmailInput, TPasswordInput } from '../schemas';

export const forgotPassword = async (
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
    res
      .status(HTTP.CODES.NotFound)
      .send({ message: LITERALS.USER_NOT_FOUND });
    return;
  }

  // TODO: Implement send reset password mail
  // await sendResetPasswordMail(user.email, hashedResetPasswordToken);

  res
    .status(HTTP.CODES.Accepted)
    .send({ message: LITERALS.RESET_PASSWORD_SENT });
};

export const resetPassword = async (
  req: FastifyRequest<{ Body: TPasswordInput }>,
  res: FastifyReply,
): Promise<Response | void> => {
  const { password } = req.body;
  const { [PARAMS.FORGOT_PASSWORD_TOKEN]: resetPasswordToken } =
    req.params as {
      [PARAMS.FORGOT_PASSWORD_TOKEN]: string;
    };
  const user: IUser | null = await getUserByProperty(
    'resetPasswordToken',
    resetPasswordToken,
  );

  const passwordMatch: boolean = await comparePasswords(
    password,
    user.password,
  );

  if (passwordMatch) {
    res
      .send(HTTP.CODES.BadRequest)
      .send({ message: LITERALS.USED_PASSWORD_ERROR });
    return;
  }

  const hashedPassword = await hashPassword(password);

  user.resetPasswordToken = undefined;
  user.password = hashedPassword;
  await user.save();

  // TODO: Implement send password set mail
  // await sendPasswordSetMail(user.email);

  res
    .status(HTTP.CODES.Accepted)
    .send({ message: LITERALS.PASSWORD_RESET });
};
