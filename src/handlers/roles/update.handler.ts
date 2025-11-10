import { FastifyRequest, FastifyReply } from 'fastify';

import { HTTP, PARAMS } from '../../constants';
import { IRole } from '../../interfaces';
import { TRoleInput } from '../../schemas';
import { Role } from '../../models';
import { ensurePermissionsExist } from '../../utils/permissionsExit.utils';
import { LITERALS } from '../../constants/literals';

export const update = async (
  req: FastifyRequest<{ Body: TRoleInput }>,
  res: FastifyReply,
) => {
  const { [PARAMS.ROLE_ID]: id } = req.params as {
    [PARAMS.ROLE_ID]: string;
  };
  const { name, description, permissions } = req.body;
  const role: IRole | null = await Role.findById(id);

  if (!role || role.deletedAt) {
    res.status(HTTP.CODES.NotFound).send({ message: LITERALS.ROLE_NOT_FOUND });
    return;
  }

  const permissionsIds = await ensurePermissionsExist(permissions);

  if (permissionsIds.length < 1) {
    res
      .status(HTTP.CODES.BadRequest)
      .send({ message: LITERALS.ROLE_WITHOUT_PERMISSION });
    return;
  }

  role.name = name;
  if (description) role.description = description;
  role.permissions = permissionsIds;

  await role.save();
  await role.populate({ path: 'permissions', select: 'name' });

  res.status(HTTP.CODES.Accepted).send({ message: LITERALS.ROLE_UPDATED, payload: role });
};