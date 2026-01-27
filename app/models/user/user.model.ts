import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    image?: string;
    emailVerified: boolean;
    stripeCustomerId?: string;
    creditBalance: number;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        image: { type: String },
        emailVerified: { type: Boolean, default: false },
        stripeCustomerId: { type: String },
        creditBalance: { type: Number, default: 0 },
    },
    { timestamps: true, collection: "users" } // Explicitly map to 'users' collection used by better-auth
);

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);
