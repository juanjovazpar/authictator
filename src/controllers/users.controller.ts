import { FastifyRequest, FastifyReply } from 'fastify';
import { hashPassword } from '../utils';
import { PARAMS, HTTP } from '../constants';
import { IUser } from '../interfaces';
import User from '../models/user.model';
import { getUserByProperty } from '../utils/findUser.utils';
import { TUserInput } from '../schemas';
import { LITERALS } from '../constants/literals';

export const register = async (
  req: FastifyRequest<{ Body: TUserInput }>,
  res: FastifyReply,
): Promise<Response | void> => {
  const { email, password, name } = req.body;

  const newUser: IUser = new User({
    name,
    email,
    password: await hashPassword(password),
  });

  await newUser.save();

  // TODO: Apply MFA verification process.env.ENABLE_MFA

  res.status(HTTP.CODES.Created).send({ message: LITERALS.USER_CREATED });
};

export const get = async (req: { user: unknown }, res: FastifyReply) => {
  const { sub } = req.user as { sub: string };
  const user: IUser | null = await getUserByProperty('_id', sub);

  res.status(HTTP.CODES.Accepted).send({ user });
};

export const update = async (
  req: FastifyRequest<{ Body: TUserInput }>,
  res: FastifyReply,
) => {
  const { name } = req.body;
  const { sub } = req.user as { sub: string };
  const user = await User.findByIdAndUpdate(
    sub,
    {
      $set: { name: name.trim() },
    },
    { new: true },
  );

  if (!user) {
    res.status(HTTP.CODES.BadRequest).send({ message: LITERALS.USER_UPDATING_ERROR });
    return;
  }

  res.status(HTTP.CODES.Accepted).send({ message: LITERALS.USER_UPDATED, payload: user });
};

export const verify = async (req: FastifyRequest, res: FastifyReply) => {
  const { [PARAMS.VERIFY_USER_TOKEN]: verificationToken } = req.params as {
    [PARAMS.VERIFY_USER_TOKEN]: string;
  };
  const user: IUser | null = await User.findOneAndUpdate(
    { verificationToken },
    {
      $set: { isVerified: true, isActive: true },
      $unset: { verificationToken: null },
    },
    { new: true },
  );

  if (!user) {
    res
      .status(HTTP.CODES.BadRequest)
      .send({ message: LITERALS.WRONG_VERIFICATION_TOKEN });
    return;
  }

  // TODO: Implement send verification mail
  // await sendVerifiedUserMail(user.email);

  res
    .status(HTTP.CODES.Accepted)
    .send({ message: LITERALS.VERIFIED_ACCOUNT });
};
