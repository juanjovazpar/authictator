import { IRequestDetails } from '../interfaces';
import mongoose, { Schema, Model } from 'mongoose';

const requestDetailsSchema: Schema<IRequestDetails> = new Schema(
  {
    ip: String,
    userAgent: String,
    referrer: String,
    geoLocation: String,
    deviceType: String,
    language: String,
    url: String,
    method: String,
    body: Object,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const RequestDetails: Model<IRequestDetails> = mongoose.model<IRequestDetails>(
  'RequestDetails',
  requestDetailsSchema,
);

export default RequestDetails;
