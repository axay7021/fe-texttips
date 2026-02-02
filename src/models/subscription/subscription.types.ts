import type { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  user: Schema.Types.ObjectId;
  plan: Schema.Types.ObjectId;
  stripeCustomerId: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}
