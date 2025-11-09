import { FastifyRequest, FastifyReply } from 'fastify';
import { hashPassword } from '../utils';
import { HTTP } from '../constants';
import { IUser } from '../interfaces';
import User from '../models/user.model';
import { TUserInput } from '../schemas';
import { LITERALS } from '../constants/literals';

export async function register(
  req: FastifyRequest<{ Body: TUserInput }>,
  res: FastifyReply,
): Promise<Response | void> {
  const { email, password, name } = req.body;

  const newUser: IUser = new User({
    name,
    email,
    password: await hashPassword(password),
  });

  await newUser.save();

  res.status(HTTP.CODES.Created).send({ message: LITERALS.USER_CREATED });

  // Send email after response so user is not kept waiting
  // TODO: Implement send new user mail
  // @ts-ignore
  if (req.server.sendEmail) {
    // @ts-ignore
    req.server.sendEmail({
      to: "juanjovazpar@gmail.com",
      subject: "subject",
      text: "text"
    });
  }
};
