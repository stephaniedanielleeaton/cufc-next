// models/User.ts

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  auth0Id: string;
  name?: string;
  email?: string;
  role: "member" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    auth0Id: { type: String, required: true, unique: true },
    name: String,
    email: String,
    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },
  },
  { timestamps: true } // creates createdAt and updatedAt
);

// Avoid model overwrite in dev
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
