import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP, PARAMS } from '../constants';
import { IPermission, IRole } from '../interfaces';
import { TPermissionInput } from '../schemas';
import { Permission, Role } from '../models';

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

  res.status(HTTP.CODES.Created).send({ message: 'Permission created successfully', payload: newPermission });
};

export const list = async (_: FastifyRequest, res: FastifyReply) => {
  const payload: IPermission[] = await Permission.find({ deletedAt: null })
  res.status(HTTP.CODES.Accepted).send({ message: `${payload.length} permissions found`, payload });
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
    res.status(HTTP.CODES.NotFound).send({ message: 'Permission not found' });
    return;
  }

  permission.name = name;
  if (description) permission.description = description;

  await permission.save();

  res.status(HTTP.CODES.Accepted).send({ message: 'Permission updated succesfully', payload: permission });
};

export const remove = async (req: FastifyRequest, res: FastifyReply) => {
  const { [PARAMS.PERMISSION_ID]: id } = req.params as {
    [PARAMS.PERMISSION_ID]: string;
  };
  const permission: IPermission | null = await Permission.findById(id);

  if (!permission || permission.deletedAt) {
    res.status(HTTP.CODES.NotFound).send({ message: 'Permission not found' });
    return;
  }

  const roles: IRole[] = await Role.find({ permissions: id, deleteAt: null });

  if (roles.length > 1) {
    res.status(HTTP.CODES.Conflict).send({ message: 'This permission is associated to active roles. Unassign this permission from roles before deleting.' });
    return;
  }

  permission.deletedAt = new Date();
  await permission.save();

  res.status(HTTP.CODES.Accepted).send({ message: 'Permission deleted succesfully' });
}