import { FastifyRequest, FastifyReply } from 'fastify';

import { HTTP, LITERALS } from '../../constants';
import { IUser } from '../../interfaces';
import { encrypt } from '../../utils';
import { TMFACodeInput } from '../../schemas';
import { verify } from './verify.handler';
import { findUser } from '../users/findUser.handler';

export async function confirmMFASecret(
    req: FastifyRequest<{ Body: TMFACodeInput }>,
    res: FastifyReply,
): Promise<void> {
    // Verify token
    const { token } = req.body;
    const userId: string = req.user?.sub;
    const secret: string | null = await req.cache.getMFA(userId);
    if (!secret || !verify(res, token, secret)) return;

    // Check if user exists
    const user: IUser | undefined = await findUser(res, '_id', userId);
    if (!user) return;

    // Set MFA secret to user
    user.mfaSecret = encrypt(secret);
    await user.save();

    res.status(HTTP.CODES.Accepted).send({
        message: LITERALS.MFA_SETUP_SUCCESSFULLY,
    });

    // Clean MFA from cache
    req.cache.delMFA(userId);
}
