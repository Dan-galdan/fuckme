import mongoose, { Schema, Document } from 'mongoose';

export interface ILevelScore extends Document {
  userId: mongoose.Types.ObjectId;
  source: 'placement' | 'retest';
  level: string | number;
  scorePercent: number;
  topicsProfile: Record<string, number>;
  weakTopics?: string[];
  createdAt: Date;
}

const LevelScoreSchema = new Schema<ILevelScore>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, enum: ['placement', 'retest'], required: true },
  level: { type: Schema.Types.Mixed, required: true },
  scorePercent: { type: Number, required: true, min: 0, max: 100 },
  topicsProfile: { type: Schema.Types.Mixed, required: true },
  weakTopics: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export const LevelScore = mongoose.model<ILevelScore>('LevelScore', LevelScoreSchema);
