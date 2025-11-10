import { FastifyReply } from 'fastify';
import { HTTP } from '../../constants';
import { IUser } from '../../interfaces';
import { getUserByProperty } from '../../utils/findUser.utils';
import { LITERALS } from '../../constants/literals';

export async function findUser(
    res: FastifyReply,
    property: string,
    value: string | null,
): Promise<IUser | undefined> {
    // Check search param exists
    if (!value || !property) {
        res.status(HTTP.CODES.NotFound).send({
            message: LITERALS.USER_NOT_FOUND,
        });
        return;
    }

    // Search user
    const user = await getUserByProperty(property, value);
    if (!user) {
        res.status(HTTP.CODES.NotFound).send({
            message: LITERALS.USER_NOT_FOUND,
        });
        return;
    }

    return user;
}
