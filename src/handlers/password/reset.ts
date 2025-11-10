import { FastifyRequest, FastifyReply } from 'fastify';

import { HTTP, PARAMS } from '../../constants';
import { LITERALS } from '../../constants/literals';
import { comparePasswords, hashPassword } from '../../utils';
import { IUser } from '../../interfaces';
import { TPasswordInput } from '../../schemas';
import { findUser } from '../users/findUser.handler';

export const reset = async (
    req: FastifyRequest<{ Body: TPasswordInput }>,
    res: FastifyReply,
): Promise<Response | void> => {
    const { password: newPassword } = req.body;
    const { [PARAMS.FORGOT_PASSWORD_TOKEN]: resetPasswordToken } =
        req.params as {
            [PARAMS.FORGOT_PASSWORD_TOKEN]: string;
        };

    // Check if user exists
    const user: IUser | undefined = await findUser(
        res,
        'resetPasswordToken',
        resetPasswordToken,
    );
    if (!user) return;

    // Check if new password is in used
    if (await comparePasswords(newPassword, user.password)) {
        res.send(HTTP.CODES.BadRequest).send({
            message: LITERALS.USED_PASSWORD_ERROR,
        });
        return;
    }

    // Set new password
    const hashedPassword = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.password = hashedPassword;
    await user.save();

    res.status(HTTP.CODES.Accepted).send({ message: LITERALS.PASSWORD_RESET });

    // TODO: Implement send password set mail
    // await sendPasswordSetMail(user.email);
};
