import { IUserAccessToken } from '../interfaces';
import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP, LITERALS } from '../constants';

export const authenticate = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const user: IUserAccessToken = await req.jwtVerify();
        const exists: number = await req.cache.isSessionActive(
            user.jwti,
            user.sub,
        );

        if (!exists) {
            return res
                .status(HTTP.CODES.Unauthorized)
                .send({ message: LITERALS.TOKEN_REVOKED });
        }
    } catch (err) {
        res.send(err);
    }
};
