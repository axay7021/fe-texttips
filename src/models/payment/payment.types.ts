import type mongoose from 'mongoose';
import type { Document } from 'mongoose';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  subscription?: mongoose.Types.ObjectId;
  stripePaymentId?: string;
  stripeInvoiceId?: string;
  amount: number;
  currency: string;
  status: string;
  type:
    | 'subscription_create'
    | 'subscription_renew'
    | 'refund'
    | 'test'
    | 'proration_credit'
    | 'payout_refund';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
