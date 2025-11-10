import { FastifyRequest, FastifyReply } from 'fastify';

import {
    comparePasswords,
    decrypt,
    getAccessToken,
    getRefreshToken,
    getUuid,
} from '../../utils';
import { HTTP } from '../../constants';
import {
    IRole,
    IUser,
    IUserAccessToken,
    IUserRefreshToken,
} from '../../interfaces';
import { TLoginInput, TMFALoginInput } from '../../schemas';
import { LITERALS } from '../../constants/literals';
import { findUser } from '../users/findUser.handler';
import { verify } from '../mfa/verify.handler';

const FORCE_MFA = process.env.FORCE_MFA || false;

export const signin = async function (
    req: FastifyRequest<{ Body: TLoginInput }>,
    res: FastifyReply,
): Promise<Response | void> {
    const { email, password } = req.body;
    // Check if user exists
    const user: IUser | undefined = await findUser(res, 'email', email);
    if (!user) return;

    // Check if user is verified and active
    if (!user.isVerified || !user.isActive) {
        res.status(HTTP.CODES.Unauthorized).send({
            message: LITERALS.USER_NOT_VERIFIED,
        });
        return;
    }

    // Check password matches
    if (!(await comparePasswords(password, user.password))) {
        res.status(HTTP.CODES.Unauthorized).send({
            message: LITERALS.INCORRECT_PASSWORD,
        });
        return;
    }

    // TODO: Force MFA always when role include the admin role
    if (FORCE_MFA && user.mfaSecret) {
        const loginId: string = getUuid();

        await req.cache.setLockedLogin(loginId, user._id as string);

        res.status(HTTP.CODES.TemporaryRedirect).send({
            message: LITERALS.MFA_CODE_REQUIRED,
            payload: loginId,
        });
        return;
    }

    return continueLogin(user, req, res);
};

export const mfaSignin = async function (
    req: FastifyRequest<{ Body: TMFALoginInput }>,
    res: FastifyReply,
): Promise<Response | void> {
    // TODO: Implement calls limit for specific identifier
    const { token, loginId } = req.body;
    const userId: string | null = await req.cache.getLockedLogin(loginId);

    // Check if user exists
    const user: IUser | undefined = await findUser(res, '_id', userId);
    if (!user) return;

    // Verify MFA secret
    const secret: string | undefined =
        user.mfaSecret && decrypt(user.mfaSecret);
    if (!secret || !verify(res, token, secret)) return;

    // Clean cache
    req.cache.delLockedLogin(loginId);

    return continueLogin(user, req, res);
};

const continueLogin = async function (
    user: IUser,
    req: FastifyRequest,
    res: FastifyReply,
): Promise<Response | void> {
    // Populate user' roles
    await user.populate({ path: 'roles', select: 'name -_id' });
    const roles: string[] = user.roles.map(
        // @ts-expect-error TODO: casting needed
        (role: IRole): string => role.name as string,
    );
    // Generate user tokens
    const accessTokenInfo: IUserAccessToken = getAccessToken(
        user._id as string,
        roles,
    );
    const refreshTokenInfo: IUserRefreshToken = getRefreshToken(
        user._id as string,
    );
    const accessToken: string = req.server.jwt.sign(accessTokenInfo);
    const refreshToken: string = req.server.jwt.sign(refreshTokenInfo);

    await req.cache.setSession(accessTokenInfo.jwti, user);

    // Set last login date
    user.last_login = new Date();
    await user.save();

    res.status(HTTP.CODES.Accepted).send({
        payload: { accessToken, refreshToken },
    });
};
