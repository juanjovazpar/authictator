import mongoose, { Schema, Model } from 'mongoose';

import { IRole } from '../interfaces';

const schema: Schema<IRole> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Name is required'],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Description is required'],
    },
    permissions: [{
      type: Schema.Types.ObjectId,
      ref: 'Permission',
      default: []
    }],
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

const Role: Model<IRole> = mongoose.model<IRole>('Role', schema);

export default Role;