import { FastifyRequest, FastifyReply } from 'fastify';

import { HTTP, PARAMS } from '../../constants';
import { IRole, IUser } from '../../interfaces';
import { Role, User } from '../../models';
import { LITERALS } from '../../constants/literals';

export const remove = async (req: FastifyRequest, res: FastifyReply) => {
    const { [PARAMS.ROLE_ID]: id } = req.params as {
        [PARAMS.ROLE_ID]: string;
    };
    // Check role exists
    const role: IRole | null = await Role.findById(id);
    if (!role || role.deletedAt) {
        res.status(HTTP.CODES.NotFound).send({
            message: LITERALS.ROLE_NOT_FOUND,
        });
        return;
    }

    // Check role is not assigned to active users
    const users: IUser[] = await User.find({ roles: id, isActive: true });
    if (users.length > 1) {
        res.status(HTTP.CODES.Conflict).send({
            message: LITERALS.ROLE_ASSIGNED_ERROR,
        });
        return;
    }

    // Soft delete role
    role.deletedAt = new Date();
    await role.save();

    res.status(HTTP.CODES.Accepted).send({ message: LITERALS.ROLE_DELETED });
};
