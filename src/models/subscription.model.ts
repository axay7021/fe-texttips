import mongoose, { type Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired';
  usageCount: number;
  planLimit: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  startDate: Date;
  endDate?: Date;
}

const SubscriptionSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    planId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active',
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    planLimit: {
      type: Number,
      default: 500, // Default limit, can be overridden per plan
    },
    currentPeriodStart: {
      type: Date,
      default: Date.now,
    },
    currentPeriodEnd: {
      type: Date,
      // Default to 1 month from now? Or set explicitly on creation
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent recompilation of model
const Subscription =
  (mongoose.models.Subscription as mongoose.Model<ISubscription>) ||
  mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
