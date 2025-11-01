import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP, PARAMS } from '../constants';
import { IRole } from '../interfaces';
import { TRoleInput } from '../schemas';
import { Role } from '../models';
import { ensurePermissionsExist } from '../utils/permissionsExit.utils';

export const create = async (
  req: FastifyRequest<{ Body: TRoleInput }>,
  res: FastifyReply,
): Promise<Response | void> => {
  const { name, description, permissions } = req.body;
  const permissionsIds = await ensurePermissionsExist(permissions);

  if (permissionsIds.length < 1) {
    res
      .status(HTTP.CODES.BadRequest)
      .send({ message: 'Role must contains at least one permission.' });
    return;
  }

  const newRole: IRole = new Role({
    name,
    description,
    permissions: permissionsIds
  });

  await newRole.save();
  await newRole.populate({ path: 'permissions', select: 'name' });

  res.status(HTTP.CODES.Created).send({ message: 'Role created successfully', payload: newRole });
};

export const list = async (_: FastifyRequest, res: FastifyReply) => {
  const payload: IRole[] = await Role.find().populate({ path: 'permissions' });
  res.status(HTTP.CODES.Accepted).send({ message: `${payload.length} roles found`, payload });
};

export const update = async (
  req: FastifyRequest<{ Body: TRoleInput }>,
  res: FastifyReply,
) => {
  const { [PARAMS.ROLE_ID]: id } = req.params as {
    [PARAMS.ROLE_ID]: string;
  };
  const { name, description, permissions } = req.body;
  const role: IRole | null = await Role.findById(id);

  if (!role) {
    res.status(HTTP.CODES.BadRequest).send({ message: 'Role not found' });
    return;
  }

  const permissionsIds = await ensurePermissionsExist(permissions);

  if (permissionsIds.length < 1) {
    res
      .status(HTTP.CODES.BadRequest)
      .send({ message: 'Role must contains at least one permission.' });
    return;
  }

  role.name = name;
  if (description) role.description = description;
  role.permissions = permissionsIds;

  await role.save();
  await role.populate({ path: 'permissions', select: 'name' });

  res.status(HTTP.CODES.Accepted).send({ message: 'Role updated succesfully', payload: role });
};

