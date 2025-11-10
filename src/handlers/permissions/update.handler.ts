import { FastifyRequest, FastifyReply } from 'fastify';

import { HTTP, PARAMS } from '../../constants';
import { IPermission } from '../../interfaces';
import { TPermissionInput } from '../../schemas';
import { Permission } from '../../models';
import { LITERALS } from '../../constants/literals';

export const update = async (
  req: FastifyRequest<{ Body: TPermissionInput }>,
  res: FastifyReply,
) => {
  const { [PARAMS.PERMISSION_ID]: id } = req.params as {
    [PARAMS.PERMISSION_ID]: string;
  };
  const { name, description } = req.body;
  const permission: IPermission | null = await Permission.findById(id);

  if (!permission || permission.deletedAt) {
    res.status(HTTP.CODES.NotFound).send({ message: LITERALS.PERMISSION_NOT_FOUND });
    return;
  }

  permission.name = name;
  if (description) permission.description = description;

  await permission.save();

  res
    .status(HTTP.CODES.Accepted)
    .send({ message: LITERALS.PERMISSION_UPDATED, payload: permission });
};
