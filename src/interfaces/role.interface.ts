import { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
  description: string;
  permissions: Schema.Types.ObjectId[];
  deletedAt?: Date;
}
