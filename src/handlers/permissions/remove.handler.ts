import { FastifyRequest, FastifyReply } from 'fastify';

import { HTTP, PARAMS } from '../../constants';
import { IPermission, IRole } from '../../interfaces';
import { Permission, Role } from '../../models';
import { LITERALS } from '../../constants/literals';

export const remove = async (req: FastifyRequest, res: FastifyReply) => {
  const { [PARAMS.PERMISSION_ID]: id } = req.params as {
    [PARAMS.PERMISSION_ID]: string;
  };
  const permission: IPermission | null = await Permission.findById(id);

  if (!permission || permission.deletedAt) {
    res.status(HTTP.CODES.NotFound).send({ message: LITERALS.PERMISSION_NOT_FOUND });
    return;
  }

  const roles: IRole[] = await Role.find({ permissions: id, deleteAt: null });

  if (roles.length > 1) {
    res.status(HTTP.CODES.Conflict).send({ message: LITERALS.ASSOCIATED_PERMISSION_ERROR });
    return;
  }

  permission.deletedAt = new Date();
  await permission.save();

  res.status(HTTP.CODES.Accepted).send({ message: LITERALS.PERMISSION_DELETED });
};
