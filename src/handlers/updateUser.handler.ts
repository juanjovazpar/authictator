import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP } from '../constants';
import User from '../models/user.model';
import { TUserInput } from '../schemas';
import { LITERALS } from '../constants/literals';

export async function update(
  req: FastifyRequest<{ Body: TUserInput }>,
  res: FastifyReply,
): Promise<Response | void> {
  const { name } = req.body;
  const { sub } = req.user as { sub: string };
  const user = await User.findByIdAndUpdate(
    sub,
    {
      $set: { name },
    },
    { new: true },
  );

  // TODO: Revoke or update token in the session cache if roles changes

  if (!user) {
    res.status(HTTP.CODES.NotFound).send({ message: LITERALS.USER_NOT_FOUND });
    return;
  }

  res.status(HTTP.CODES.Accepted).send({ message: LITERALS.USER_UPDATED, payload: user });
}
