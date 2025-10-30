import { IUser } from '../interfaces';
import { HTTP } from '../constants';
import { User } from '../models';
import { ErrorWithStatusCode } from '../interfaces';

export const getUserByProperty = async (
  propertyName: string,
  propertyValue: string,
): Promise<IUser> => {
  const user: IUser | null = await User.findOne({
    [propertyName]: propertyValue,
  });

  if (!user) {
    const error: ErrorWithStatusCode = new Error('User not found');
    error['statusCode'] = HTTP.CODES.NotFound;
    throw error;
  }

  return user;
};
