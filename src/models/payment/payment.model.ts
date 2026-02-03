import mongoose, { Schema } from 'mongoose';
import { schemaOptions } from '../common.model';
import type { IPayment } from './payment.types';

const paymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User not found'],
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: [true, 'Subscription not found'],
    },
    stripePaymentId: { type: String },
    stripeInvoiceId: { type: String },
    amount: { type: Number, required: true }, // Amount in dollars (e.g., 19.00)
    currency: { type: String, default: 'usd' },
    status: { type: String, required: true }, // succeeded, refunded, failed
    type: {
      type: String,
      enum: [
        'subscription_create',
        'subscription_renew',
        'refund',
        'test',
        'proration_credit',
        'payout_refund',
      ],
      required: true,
    },
    metadata: { type: Schema.Types.Mixed },
  },
  schemaOptions,
);

// Index for getting a user's payment history
paymentSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.Payment ||
  mongoose.model<IPayment>('Payment', paymentSchema);
