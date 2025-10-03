import mongoose, { Schema, Document } from 'mongoose';

export interface ITest extends Document {
  type: 'placement' | 'topic';
  title: string;
  description?: string;
  gradeRange: string[];
  topics: string[];
  timeLimitSec?: number;
  questionRefs: Array<{
    questionId: mongoose.Types.ObjectId;
    weight: number;
    difficulty: number;
  }>;
  isActive: boolean;
}

const TestSchema = new Schema<ITest>({
  type: { type: String, enum: ['placement', 'topic'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  gradeRange: { type: [String], required: true },
  topics: { type: [String], required: true },
  timeLimitSec: { type: Number },
  questionRefs: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    weight: { type: Number, required: true, min: 0, max: 1 },
    difficulty: { type: Number, required: true, min: 1, max: 5 }
  }],
  isActive: { type: Boolean, default: true }
});

export const Test = mongoose.model<ITest>('Test', TestSchema);
