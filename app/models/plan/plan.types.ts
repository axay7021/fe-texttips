import type { Document } from 'mongoose';

export interface IPlan {
  _id: string;
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

export interface IPlanDocument extends Omit<IPlan, '_id'>, Document {}
