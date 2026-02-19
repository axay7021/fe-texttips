import mongoose, { type Document, Schema } from 'mongoose';

export interface IDailyUsage extends Document {
  identifier: string; // IP address or User ID
  count: number;
  date: Date; // The date this count belongs to (normalized to midnight UTC)
}

const DailyUsageSchema: Schema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true, // We'll manage date resets logically or update this to be compound index if we kept history
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent recompilation of model
const DailyUsage =
  (mongoose.models.DailyUsage as mongoose.Model<IDailyUsage>) ||
  mongoose.model<IDailyUsage>('DailyUsage', DailyUsageSchema);

export default DailyUsage;
