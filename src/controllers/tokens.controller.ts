import fastify, { FastifyRequest, FastifyReply } from 'fastify';

import { comparePasswords } from '../utils';
import { HTTP } from '../constants';
import { IUser } from '../interfaces';
import { getUserByProperty } from '../utils/findUser.utils';
import { TLoginInput } from '../schemas/user.schema';

const Fastify = fastify()

export const signin = async function (
  req: FastifyRequest<{ Body: TLoginInput }>,
  res: FastifyReply,
): Promise<Response | void> {
  const { email, password } = req.body;
  const user: IUser | null = await getUserByProperty('email', email);

  if (!user.isVerified || user.deleted) {
    res.status(HTTP.CODES.Unauthorized).send({
      message: 'Authentication failed. User not verified or inactive.',
    });
    return;
  }

  const passwordMatch: boolean = await comparePasswords(
    password,
    user.password,
  );

  if (!passwordMatch) {
    res
      .status(HTTP.CODES.Unauthorized)
      .send({ message: 'Authentication failed. Incorrect password.' });
    return;
  }

  // TODO: Apply MFA verification process.env.ENABLE_MFA
  // TODO: Signing users with something different than their DB id?
  const accessToken = Fastify.jwt.sign({ sub: user._id, role: [] });

  user.last_login = new Date();
  await user.save();

  res.status(HTTP.CODES.Accepted).send({
    accessToken,
  });
};

