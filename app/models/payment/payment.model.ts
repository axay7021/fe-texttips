import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
    user: mongoose.Types.ObjectId;
    subscription?: mongoose.Types.ObjectId;
    stripePaymentId?: string;
    stripeInvoiceId?: string;
    amount: number;
    currency: string;
    status: string;
    type: "subscription_create" | "subscription_renew" | "refund" | "test" | "proration_credit" | "payout_refund";
    metadata?: Record<string, any>;
    createdAt: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        subscription: { type: Schema.Types.ObjectId, ref: "Subscription" },
        stripePaymentId: { type: String },
        stripeInvoiceId: { type: String },
        amount: { type: Number, required: true }, // Amount in dollars (e.g., 19.00)
        currency: { type: String, default: "usd" },
        status: { type: String, required: true }, // succeeded, refunded, failed
        type: {
            type: String,
            enum: ["subscription_create", "subscription_renew", "refund", "test", "proration_credit", "payout_refund"],
            required: true,
        },
        metadata: { type: Schema.Types.Mixed },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

// Index for getting a user's payment history
paymentSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", paymentSchema);
