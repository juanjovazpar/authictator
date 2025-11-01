import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP } from '../constants';
import { IRole } from '../interfaces';
import { TRoleInput } from '../schemas';
import { Role, Permission } from '../models';
import { ObjectId, Schema } from 'mongoose';

export const create = async (
  req: FastifyRequest<{ Body: TRoleInput }>,
  res: FastifyReply,
): Promise<Response | void> => {
  const { name, description, permissions } = req.body;

  await Permission.bulkWrite(
    permissions.map(name => ({
      updateOne: {
        filter: { name },
        update: { $setOnInsert: { name } },
        upsert: true,
      },
    }))
  );

  const permissionsIds = await Permission.find({ name: { $in: permissions } }, { _id: 1 }).lean();

  if (permissionsIds.length < 1) {
    res
      .status(HTTP.CODES.BadRequest)
      .send({ message: 'Role must contains at least one permission.' });
    return;
  }

  const newRole: IRole = new Role({
    name,
    description,
    permissions: permissionsIds.map(p => p._id)
  });

  await newRole.save();
  await newRole.populate({ path: 'permissions', select: 'name -_id' });

  res.status(HTTP.CODES.Created).send({ message: 'Role created successfully', payload: newRole });
};

export const list = async (_: FastifyRequest, res: FastifyReply) => {
  const payload: IRole[] = await Role.find().populate({ path: 'permissions', select: 'name -_id' });
  res.status(HTTP.CODES.Accepted).send({ message: `${payload.length} roles found`, payload });
};