import mongoose, { Schema } from 'mongoose';
import { schemaOptions } from '../common.model';
import type { IPlanDocument } from './plan.types';

const planSchema = new Schema<IPlanDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    originalPriceUsd: {
      type: Number,
      required: [true, 'Original price is required'],
    },
    priceUsd: {
      type: Number,
      required: [true, 'Price is required'],
    },
    stripeProductId: {
      type: String,
      required: [true, 'Stripe Product ID is required'],
    },
    wordLimit: {
      type: Number,
      required: [true, 'Word limit is required'],
      default: 1000,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['personal', 'business'],
      default: 'personal',
    },
  },
  schemaOptions,
);

// Create indexes for better query performance
planSchema.index({ name: 1, createdAt: -1 });

export default mongoose.models.Plan ||
  mongoose.model<IPlanDocument>('Plan', planSchema);
