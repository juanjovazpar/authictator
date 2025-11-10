import { FastifyRequest, FastifyReply } from 'fastify';

import { HTTP, LITERALS } from '../../constants';
import { TUserInput } from '../../schemas';
import { Role, User } from '../../models';
import { IRole, IUser } from '../../interfaces';
import { hashPassword } from '../../utils';

const DEFAULT_ROLE = process.env.DEFAULT_ROLE || 'user:default';
const ADMIN_ROLE_NAME = process.env.ADMIN_ROLE_NAME;

export async function register(
    req: FastifyRequest<{ Body: TUserInput }>,
    res: FastifyReply,
): Promise<Response | void> {
    const { name, email, password, roles } = req.body;
    // Set roles for the new user, filter admin role
    const rolesEntities: IRole[] = await Role.find({
        name: {
            $in: roles?.filter((roles: string) => roles !== ADMIN_ROLE_NAME),
        },
    }).select('_id');
    const rolesIds: string[] = rolesEntities.map((role) => role._id as string);
    const defaultUserRoleId: IRole = await Role.findOne({
        name: DEFAULT_ROLE,
    }).select('_id');

    if (rolesIds.length == 0) rolesIds.push(defaultUserRoleId._id as string);

    // Create new user
    const newUser: IUser = new User({
        name,
        email,
        password: await hashPassword(password),
        roles: rolesIds,
    });
    await newUser.save();

    res.status(HTTP.CODES.Created).send({ message: LITERALS.USER_CREATED });

    // TODO: Implement send new user mail
    if (req.server.sendEmail) {
        req.server.sendEmail('juanjovazpar@gmail.com', 'subject', 'text');
    }
}
