import { FastifyRequest, FastifyReply } from 'fastify';

import { HTTP } from '../../constants';
import { LITERALS } from '../../constants/literals';
import { getHashedToken } from '../../utils';
import { IUser } from '../../interfaces';
import { User } from '../../models';
import { TEmailInput } from '../../schemas';

const EXPIRATION_TIME: number = 60 * 60 * 1000;

export const forgot = async (
    req: FastifyRequest<{ Body: TEmailInput }>,
    res: FastifyReply,
): Promise<Response | void> => {
    // Set token to reset password
    const { email } = req.body;
    const resetPasswordToken = await getHashedToken(EXPIRATION_TIME);
    const user: IUser | null = await User.findOneAndUpdate(
        { email },
        {
            $set: { resetPasswordToken },
        },
        { new: true },
    );

    // Check user exists
    if (!user) {
        res.status(HTTP.CODES.NotFound).send({
            message: LITERALS.USER_NOT_FOUND,
        });
        return;
    }

    // TODO: Check if MFA is activated - Mandatory for Admins

    res.status(HTTP.CODES.Accepted).send({
        message: LITERALS.RESET_PASSWORD_SENT,
    });

    // TODO: Implement send reset password mail
    // await sendResetPasswordMail(user.email, hashedResetPasswordToken);
};
