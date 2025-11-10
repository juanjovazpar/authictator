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
    roles: Schema.Types.ObjectId[];
    mfaSecret?: string;
}

export interface IUserAccessToken {
    jwti: string;
    sub: string;
    roles: string[];
    iat?: number;
    exp?: number;
}
export interface IUserRefreshToken {
    jwti: string;
    sub: string;
    iat?: number;
    exp?: number;
}
