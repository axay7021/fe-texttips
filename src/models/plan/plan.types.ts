import type { Document } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  originalPriceUsd: number;
  priceUsd: number;
  stripeProductId: string;
  description: string;
  wordLimit: number; // Max words per month
  features: string[]; // List of features for UI
  isActive: boolean;
  type: 'personal' | 'business';
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
}
