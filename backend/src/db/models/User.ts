import mongoose, { Schema, Document } from 'mongoose';
import { UserGradeSchema, UserRoleSchema } from '@physics-school/shared';

export interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
  grade: string;
  goals: string[];
  passwordHash: string;
  emailVerifiedAt?: Date;
  roles: string[];
  subscriptionStatus: 'inactive' | 'active' | 'past_due' | 'canceled';
  currentLevel?: string | number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, minlength: 2, maxlength: 100 },
  phone: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  grade: { type: String, enum: ['6', '7', '8', '9', '10', '11', '12', 'EESH'], required: true },
  goals: { type: [String], required: true, minlength: 1, maxlength: 10 },
  passwordHash: { type: String, required: true },
  emailVerifiedAt: { type: Date },
  roles: { type: [String], enum: ['student', 'admin'], default: ['student'] },
  subscriptionStatus: { 
    type: String, 
    enum: ['inactive', 'active', 'past_due', 'canceled'], 
    default: 'inactive' 
  },
  currentLevel: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', UserSchema);
