import { FastifyReply } from 'fastify';

import { HTTP, LITERALS } from '../../constants';
import { verifySecret } from '../../utils';

export async function verify(
    res: FastifyReply,
    token: string,
    secret: string | null,
): Promise<boolean> {
    // Check secret is defined
    if (!secret) {
        res.status(HTTP.CODES.NotFound).send({
            message: LITERALS.MFA_SECRET_EXPIRED,
        });
        return false;
    }

    // Verify token is correct
    if (!verifySecret(secret, token)) {
        res.status(HTTP.CODES.BadRequest).send({
            message: LITERALS.MFA_SETUP_UNSUCCESSFULL,
        });
        return false;
    }

    return true;
}
