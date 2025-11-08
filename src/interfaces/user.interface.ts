import { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  isVerified: boolean;
  isActive: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  last_login?: Date;
  deleted?: Date;
  roles: Schema.Types.ObjectId[]
}

export interface IUserToken {
  jwti: string,
  sub: string,
  roles: string[],
  iat: number,
  exp: number
}