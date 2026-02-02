import mongoose, { Schema } from 'mongoose';
import { schemaOptions } from '../common.model';
import type { ISubscription } from './subscription.types';

const subscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: [true, 'Plan is required'],
    },
    stripeCustomerId: {
      type: String,
      required: [true, 'Stripe Customer ID is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions,
);

// Create indexes for better query performance
subscriptionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.Subscription ||
  mongoose.model<ISubscription>('Subscription', subscriptionSchema);
