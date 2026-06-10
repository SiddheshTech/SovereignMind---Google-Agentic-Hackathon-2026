import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  company: string;
  role: string;
  agreedToTerms: boolean;
  enclaveRegion: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      default: 'Sector Level 3 Planner',
      trim: true,
    },
    agreedToTerms: {
      type: Boolean,
      default: false,
    },
    enclaveRegion: {
      type: String,
      default: 'Alpine Sector-12 Tactical Enclave',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure email index
UserSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model<IUser>('User', UserSchema);
