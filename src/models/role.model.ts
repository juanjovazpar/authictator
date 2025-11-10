import mongoose, { Schema, Model } from 'mongoose';

import { IRole } from '../interfaces';

const adminRoleName = process.env.ADMIN_ROLE_NAME || 'admin';

const schema: Schema<IRole> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Name is required'],
      unique: true,
      index: true,
      validate: {
        validator: function (value: string) {
          return value !== adminRoleName;
        },
        message: (props) => `Name ${props.value} is forbidden for a role`,
      },
    },
    description: {
      type: String,
      trim: true,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Permission',
        default: [],
      },
    ],
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

schema.index({ name: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });

schema.methods.toJSON = function () {
  const obj = this.toObject();
  return {
    _id: obj._id,
    name: obj.name,
    description: obj.description,
    permissions: obj.permissions,
  };
};

const Role: Model<IRole> = mongoose.model<IRole>('Role', schema);

export default Role;
