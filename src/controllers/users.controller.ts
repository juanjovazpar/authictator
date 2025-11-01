import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { hashPassword } from '../utils';
import { PARAMS, HTTP } from '../constants';
import { IUser } from '../interfaces';
import User from '../models/user.model';
import { getUserByProperty } from '../utils/findUser.utils';
import { TUserInput } from '../schemas';
import { LITERALS } from '../constants/literals';

export async function register(
  this: FastifyInstance,
  req: FastifyRequest<{ Body: TUserInput }>,
  res: FastifyReply,
): Promise<void> {
  const { email, password, name } = req.body;

  const newUser: IUser = new User({
    name,
    email,
    password: await hashPassword(password),
  });

  await newUser.save();

  // @ts-ignore
  if (req.server.sendEmail) {
    // @ts-ignore
    await req.server.sendEmail({
      to: "juanjovazpar@gmail.com",
      subject: "subject",
      text: "text"
    });
  }


  res.status(HTTP.CODES.Created).send({ message: LITERALS.USER_CREATED });
};

export async function get(
  this: FastifyInstance,
  req: { user: unknown },
  res: FastifyReply
): Promise<void> {
  const { sub } = req.user as { sub: string };
  const user: IUser | null = await getUserByProperty('_id', sub);

  res.status(HTTP.CODES.Accepted).send({ user });
};

export async function update(
  this: FastifyInstance,
  req: FastifyRequest<{ Body: TUserInput }>,
  res: FastifyReply,
): Promise<void> {
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

export async function verify(
  this: FastifyInstance,
  req: FastifyRequest,
  res: FastifyReply
): Promise<void> {
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
