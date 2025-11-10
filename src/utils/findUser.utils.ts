import { IUser } from '../interfaces';
import { HTTP, LITERALS } from '../constants';
import { User } from '../models';
import { IErrorWithStatusCode } from '../interfaces';

export const getUserByProperty = async (
    propertyName: string,
    propertyValue: string,
): Promise<IUser> => {
    const user: IUser | null = await User.findOne({
        [propertyName]: propertyValue,
    });

    if (!user) {
        const error: IErrorWithStatusCode = new Error(LITERALS.USER_NOT_FOUND);
        error['statusCode'] = HTTP.CODES.NotFound;
        throw error;
    }

    return user;
};
