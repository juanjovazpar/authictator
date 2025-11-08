import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { PARAMS, HTTP } from '../constants';
import { IUser } from '../interfaces';
import User from '../models/user.model';
import { LITERALS } from '../constants/literals';

export async function verify(
  req: FastifyRequest,
  res: FastifyReply,
): Promise<Response | void> {
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

  res
    .status(HTTP.CODES.Accepted)
    .send({ message: LITERALS.VERIFIED_ACCOUNT });

  // Send email after response so user is not kept waiting
  // TODO: Implement send verification mail
  // await sendVerifiedUserMail(user.email);
};
