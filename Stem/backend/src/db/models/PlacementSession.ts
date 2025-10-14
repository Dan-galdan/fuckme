import mongoose, { Schema, Document } from 'mongoose';

export interface IPlacementSession extends Document {
  sessionId: string;
  name: string;
  phone: string;
  email: string;
  grade: string;
  goals: string[];
  password: string;
  levelEstimate?: string;
  topicsProfile?: Record<string, number>;
  createdAt: Date;
  expiresAt: Date;
}

const PlacementSessionSchema = new Schema<IPlacementSession>({
  sessionId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  grade: { type: String, required: true },
  goals: { type: [String], required: true },
  password: { type: String, required: true },
  levelEstimate: { type: String },
  topicsProfile: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) } // 24 hours
});

// Create TTL index for automatic cleanup
PlacementSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PlacementSession = mongoose.model<IPlacementSession>('PlacementSession', PlacementSessionSchema);
