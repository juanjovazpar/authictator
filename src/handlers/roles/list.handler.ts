import { FastifyRequest, FastifyReply } from 'fastify';
import { sprintf } from 'sprintf-js';

import { HTTP } from '../../constants';
import { IRole } from '../../interfaces';
import { Role } from '../../models';
import { LITERALS } from '../../constants/literals';

export const list = async (_: FastifyRequest, res: FastifyReply) => {
  const payload: IRole[] = await Role.find({ deletedAt: null }).populate({
    path: 'permissions',
    select: 'name description',
  });
  res
    .status(HTTP.CODES.Accepted)
    .send({ message: sprintf(LITERALS.ROLES_FOUND_LENGTH, payload.length), payload });
};
