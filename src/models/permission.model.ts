import mongoose, { Schema, Model } from 'mongoose';

import { IPermission } from '../interfaces';

const schema: Schema<IPermission> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Name is required'],
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    deletedAt: {
      type: Date,
      default: null
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

schema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

schema.methods.toJSON = function () {
  const obj = this.toObject();
  return {
    _id: obj._id,
    name: obj.name,
    description: obj.description,
  };
};

const Permission: Model<IPermission> = mongoose.model<IPermission>('Permission', schema);

export default Permission;