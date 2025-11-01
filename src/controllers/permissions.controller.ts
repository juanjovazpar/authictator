import { FastifyRequest, FastifyReply } from 'fastify';
import { sprintf } from 'sprintf-js';

import { HTTP, PARAMS } from '../constants';
import { IPermission, IRole } from '../interfaces';
import { TPermissionInput } from '../schemas';
import { Permission, Role } from '../models';
import { LITERALS } from '../constants/literals';

export const create = async (
  req: FastifyRequest<{ Body: TPermissionInput }>,
  res: FastifyReply,
): Promise<Response | void> => {
  const { name, description } = req.body;

  const newPermission: IPermission = new Permission({
    name,
    description
  });

  await newPermission.save();

  res.status(HTTP.CODES.Created).send({ message: LITERALS.PERMISSION_CREATED, payload: newPermission });
};

export const list = async (_: FastifyRequest, res: FastifyReply) => {
  const payload: IPermission[] = await Permission.find({ deletedAt: null })
  res.status(HTTP.CODES.Accepted).send({ message: sprintf(LITERALS.PERMISSIONS_FOUND_LENGTH, payload.length), payload });
};

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

  res.status(HTTP.CODES.Accepted).send({ message: LITERALS.PERMISSION_UPDATED, payload: permission });
};

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
}