import { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  last_login?: Date;
  deleted?: Date;
  roles: Schema.Types.ObjectId[]
}
