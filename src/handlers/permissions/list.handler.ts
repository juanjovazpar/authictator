import { FastifyRequest, FastifyReply } from 'fastify';
import { sprintf } from 'sprintf-js';

import { HTTP } from '../../constants';
import { IPermission } from '../../interfaces';
import { Permission } from '../../models';
import { LITERALS } from '../../constants/literals';

export const list = async (_: FastifyRequest, res: FastifyReply) => {
    const payload: IPermission[] = await Permission.find({ deletedAt: null });
    res.status(HTTP.CODES.Accepted).send({
        message: sprintf(LITERALS.PERMISSIONS_FOUND_LENGTH, payload.length),
        payload,
    });
};
