import { FastifyRequest, FastifyReply } from 'fastify';

import { HTTP } from '../../constants';
import { IRole } from '../../interfaces';
import { TRoleInput } from '../../schemas';
import { Role } from '../../models';
import { ensurePermissionsExist } from '../../utils/permissionsExit.utils';
import { LITERALS } from '../../constants/literals';

export const create = async (
  req: FastifyRequest<{ Body: TRoleInput }>,
  res: FastifyReply,
): Promise<Response | void> => {
  const { name, description, permissions } = req.body;
  const permissionsIds = await ensurePermissionsExist(permissions);

  if (permissionsIds.length < 1) {
    res.status(HTTP.CODES.BadRequest).send({ message: LITERALS.ROLE_WITHOUT_PERMISSION });
    return;
  }

  const newRole: IRole = new Role({
    name,
    description,
    permissions: permissionsIds,
  });

  await newRole.save();
  await newRole.populate({ path: 'permissions', select: 'name' });

  res.status(HTTP.CODES.Created).send({ message: LITERALS.ROLE_CREATED, payload: newRole });
};
