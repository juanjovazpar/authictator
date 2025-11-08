import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

import { comparePasswords } from '../utils';
import { HTTP } from '../constants';
import { IUser } from '../interfaces';
import { getUserByProperty } from '../utils/findUser.utils';
import { TLoginInput } from '../schemas/user.schema';
import { LITERALS } from '../constants/literals';

export const signin = async function (
  req: FastifyRequest<{ Body: TLoginInput }>,
  res: FastifyReply,
): Promise<Response | void> {
  const { email, password } = req.body;
  const user: IUser | null = await getUserByProperty('email', email);

  if (!user) {
    res.status(HTTP.CODES.NotFound).send({
      message: LITERALS.USER_NOT_FOUND,
    });
    return;
  }

  if (!user.isVerified || !user.isActive) {
    res.status(HTTP.CODES.Unauthorized).send({
      message: LITERALS.USER_NOT_VERIFIED,
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
      .send({ message: LITERALS.INCORRECT_PASSWORD });
    return;
  }

  // TODO: If role is ADMIN, force MFA login

  // TODO: Apply MFA verification process.env.ENABLE_MFA
  // TODO: Signing users with something different than their DB id?
  const jwti: string = uuidv4();
  const sub: string = user._id as string;
  const accessToken: string = req.server.jwt.sign({
    jwti,
    sub,
    roles: user.roles
  });
  // TODO: Implemente refresh token
  // const refreshToken = req.server.refresh.sign({ sub: user._id });

  const cacheKey = `sessions:${user._id}:${jwti}`;
  await req.server.cache.hset(cacheKey, {
    sub,
    name: user.name,
    email: user.email,
    roles: JSON.stringify(user.roles)
  });
  // TODO: Abstract TTL to a .env variable same than token expiration time
  await req.server.cache.expire(cacheKey, 10000); // Set TTL in .env

  user.last_login = new Date();
  await user.save();

  res.status(HTTP.CODES.Accepted).send({
    accessToken,
    refreshToken: 'TODO',
  });
};
