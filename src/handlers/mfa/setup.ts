import { FastifyRequest, FastifyReply } from 'fastify';
import { GeneratedSecret } from 'speakeasy';

import { HTTP } from '../../constants';
import { LITERALS } from '../../constants/literals';
import { IUser } from '../../interfaces';
import { findUser } from '../users/findUser.handler';
import { getSecret } from '../../utils';

export async function requestMFASecret(
    req: FastifyRequest,
    res: FastifyReply,
): Promise<void> {
    // Check if user exists
    const userId = req.user?.sub;
    const user: IUser | undefined = await findUser(res, '_id', userId);
    if (!user) return;

    // Set a temporary new MFA secret
    const secret: GeneratedSecret = getSecret();
    await req.cache.setMFA(secret.base32, userId);

    res.status(HTTP.CODES.Accepted).send({
        message: LITERALS.MFA_SECRET_SEND,
        payload: {
            secret: secret.otpauth_url,
        },
    });
}
