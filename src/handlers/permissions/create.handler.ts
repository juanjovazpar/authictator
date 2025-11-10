import { FastifyRequest, FastifyReply } from 'fastify';

import { HTTP } from '../../constants';
import { IPermission } from '../../interfaces';
import { TPermissionInput } from '../../schemas';
import { Permission } from '../../models';
import { LITERALS } from '../../constants/literals';

export const create = async (
    req: FastifyRequest<{ Body: TPermissionInput }>,
    res: FastifyReply,
): Promise<Response | void> => {
    // Create new permission
    const { name, description } = req.body;
    const newPermission: IPermission = new Permission({
        name,
        description,
    });
    await newPermission.save();

    res.status(HTTP.CODES.Created).send({
        message: LITERALS.PERMISSION_CREATED,
        payload: newPermission,
    });
};
