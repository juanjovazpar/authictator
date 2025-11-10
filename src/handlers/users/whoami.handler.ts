import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP } from '../../constants';
import { findUser } from './findUser.handler';
import { IUser } from '../../interfaces';

export async function whoami(
    req: FastifyRequest,
    res: FastifyReply,
): Promise<void> {
    const userId = req.user?.sub;
    // Check if user exists
    const user: IUser | undefined = await findUser(res, '_id', userId);
    if (!user) return;

    res.status(HTTP.CODES.Accepted).send({ payload: user });
}
