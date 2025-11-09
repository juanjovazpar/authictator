import mongoose, { Schema, Model, CallbackError } from 'mongoose';

import { IUser } from '../interfaces';
import { isValidEmail, getHashedToken } from '../utils';

const adminRoleName = process.env.ADMIN_ROLE_NAME || 'admin';

const schema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, 'Email is required'],
      validate: {
        validator: function (value: string) {
          if (!isValidEmail) throw new Error('Validator is undefined!');
          return isValidEmail(value);
        },
        message: (props) => `${props.value} is not a valid email format`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
      validate: {
        validator: function (value: string) { return value !== adminRoleName; },
        message: (props) => `Name ${props.value} is forbidden for an user`,
      }
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    mfaSecret: {
      type: String,
    },
    roles: [{
      type: Schema.Types.ObjectId,
      ref: 'Role',
      default: []
    }],
    last_login: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

schema.pre<IUser>('save', async function (next) {
  try {
    if (this.isNew) {
      const hashedVerificationToken = await getHashedToken();
      this.verificationToken = hashedVerificationToken;
    }

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

schema.methods.toJSON = function () {
  const obj = this.toObject();
  return {
    name: obj.name,
    email: obj.email,
    last_login: obj.last_login,
    updatedAt: obj.updatedAt,
    createdAt: obj.createdAt,
  };
};

const User: Model<IUser> = mongoose.model<IUser>('User', schema);

export default User;

export function findOneAndUpdate(arg0: { email: string; }, arg1: { $set: { resetPasswordToken: string; }; }, arg2: { new: boolean; }): IUser | PromiseLike<IUser | null> | null {
  throw new Error('Function not implemented.');
}
