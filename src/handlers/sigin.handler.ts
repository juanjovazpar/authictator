import { FastifyRequest, FastifyReply } from 'fastify';
import speakeasy from 'speakeasy';

import { comparePasswords, getUserByProperty, getUuid } from '../utils';
import { HTTP } from '../constants';
import { IUser } from '../interfaces';
import { TLoginInput, TMFALoginInput } from '../schemas';
import { LITERALS } from '../constants/literals';

const FORCE_MFA = process.env.FORCE_MFA || false;

export const signin = async function (
  req: FastifyRequest<{ Body: TLoginInput }>,
  res: FastifyReply,
): Promise<Response | void> {
  const { email, password } = req.body;
  const user: IUser = await getUserByProperty('email', email);

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

  const passwordMatch: boolean = await comparePasswords(password, user.password);

  if (!passwordMatch) {
    res.status(HTTP.CODES.Unauthorized).send({ message: LITERALS.INCORRECT_PASSWORD });
    return;
  }

  const loginId: string = getUuid();
  // TODO: Force always when role include the admin role
  if (FORCE_MFA) {
    await req.cache.setLockedLogin(loginId, user._id as string);
    res.status(HTTP.CODES.TemporaryRedirect).send({
      message: LITERALS.MFA_CODE_REQUIRED,
      payload: loginId,
    });
    return;
  }

  return continueLogin(user, req, res);
};

export const mfaSignin = async function (
  req: FastifyRequest<{ Body: TMFALoginInput }>,
  res: FastifyReply,
): Promise<Response | void> {
  // TODO: Implement calls limit for specific identifier
  const { token, loginId } = req.body;
  const userId: string | null = await req.cache.getLockedLogin(loginId);

  if (!userId) {
    res.status(HTTP.CODES.NotFound).send({
      message: LITERALS.USER_NOT_FOUND,
    });
    return;
  }

  const user: IUser | null = await getUserByProperty('_id', userId);

  if (!user) {
    res.status(HTTP.CODES.NotFound).send({
      message: LITERALS.USER_NOT_FOUND,
    });
    return;
  }

  const secret = user.mfaSecret;

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

  req.cache.delLockedLogin(loginId);

  return continueLogin(user, req, res);
};

const continueLogin = async function (
  user: IUser,
  req: FastifyRequest,
  res: FastifyReply,
): Promise<Response | void> {
  const jwti: string = getUuid();
  const sub = user._id;
  const accessToken: string = req.server.jwt.sign({
    jwti,
    sub,
    roles: user.roles,
  });
  // TODO: Implement refresh token
  const refreshToken = req.server.jwt.sign({ sub: user._id });

  await req.cache.setSession(jwti, user);

  user.last_login = new Date();
  await user.save();

  res.status(HTTP.CODES.Accepted).send({ payload: { accessToken, refreshToken } });
};
