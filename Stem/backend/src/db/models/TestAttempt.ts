import mongoose, { Schema, Document } from 'mongoose';

export interface ITestAttempt extends Document {
  userId?: mongoose.Types.ObjectId;
  testId: mongoose.Types.ObjectId;
  startedAt: Date;
  submittedAt?: Date;
  items: Array<{
    questionId: mongoose.Types.ObjectId;
    answer: string | number;
    correct: boolean;
    score: number;
    topicTags: string[];
  }>;
  totalScore: number;
  levelEstimate?: string;
  summaryWeakTopics: string[];
}

const TestAttemptSchema = new Schema<ITestAttempt>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
  startedAt: { type: Date, required: true },
  submittedAt: { type: Date },
  items: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    answer: { type: Schema.Types.Mixed, required: true },
    correct: { type: Boolean, required: true },
    score: { type: Number, required: true },
    topicTags: { type: [String], required: true }
  }],
  totalScore: { type: Number, required: true },
  levelEstimate: { type: String },
  summaryWeakTopics: { type: [String], required: true }
});

export const TestAttempt = mongoose.model<ITestAttempt>('TestAttempt', TestAttemptSchema);
