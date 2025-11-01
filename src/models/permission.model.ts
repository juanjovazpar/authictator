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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

schema.methods.toJSON = function () {
  const obj = this.toObject();
  return {
    name: obj.name,
    description: obj.description,
  };
};

const Permission: Model<IPermission> = mongoose.model<IPermission>('Permission', schema);

export default Permission;