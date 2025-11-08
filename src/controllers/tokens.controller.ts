import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

import { comparePasswords } from '../utils';
import { HTTP } from '../constants';
import { IUser, ILogoutQuery } from '../interfaces';
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
  const jwti = uuidv4();
  const accessToken = req.server.jwt.sign({
    jwti,
    sub: user._id,
    roles: user.roles
  });
  // TODO: Abstract decorator properly to add them into fastify object
  const cacheKey = `sessions:${user._id}:${jwti}`;
  // @ts-ignore
  await req.server.cache.hset(cacheKey, {
    id: user._id,
    name: user.name,
    email: user.email,
    roles: JSON.stringify(user.roles)
  });
  // @ts-ignore
  // TODO: Abstract TTL to a .env variable same than token expiration time
  await req.server.cache.expire(cacheKey, 100); // Set TTL in .env
  // TODO: Implemente refresh token
  // const refreshToken = req.server.refresh.sign({ sub: user._id });

  user.last_login = new Date();
  await user.save();

  res.status(HTTP.CODES.Accepted).send({
    accessToken,
    refreshToken: 'TODO',
  });
};

export const logout = async function (
  req: FastifyRequest<{ Querystring: ILogoutQuery }>,
  res: FastifyReply,
): Promise<Response | void> {
  const { allsessions } = req.query;
  const userId = req.user?.sub;
  const jwti = req.user?.jwti;

  console.log('allsessions', allsessions);
  console.log('type allsessions', typeof allsessions);
  console.log('userId', userId);
  console.log('jwti', jwti);

  if (!userId || !jwti) {
    res.status(HTTP.CODES.Unauthorized).send({
      message: LITERALS.USER_NOT_FOUND,
    });
    return;
  }

  if (allsessions) {
    // @ts-ignore
    await req.server.cache.del(`sessions:${userId}`);
  } else {
    // @ts-ignore
    await req.server.cache.hdel(`sessions:${userId}`, jwti);
  }

  res.status(HTTP.CODES.Accepted).send({
    message: LITERALS.USER_LOGOUT,
  });
};

