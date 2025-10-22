import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  stem: string;
  kind: 'mcq' | 'numeric' | 'short_text';
  options?: Array<{
    id: string;
    text: string;
    isCorrect?: boolean;
    imageUrl?: string; // ✅ Add this
  }>;
  answerKey: number | string | RegExp;
  topics: string[];
  difficulty: number;
  imageUrl?: string; // ✅ Add this
  grade?: string;
  subject?: string;
}

const QuestionSchema = new Schema<IQuestion>({
  stem: { type: String, required: true },
  kind: { type: String, enum: ['mcq', 'numeric', 'short_text'], required: true },
  options: [{
    id: { type: String, required: true },
    text: { type: String, required: true },
    isCorrect: { type: Boolean },
    imageUrl: { type: String } // ✅ Add this
  }],
  answerKey: { type: Schema.Types.Mixed, required: true },
  topics: { type: [String], required: true },
  difficulty: { type: Number, required: true, min: 1, max: 5 },
  imageUrl: { type: String }, // ✅ Add this
  grade: { type: String },
  subject: { type: String }
});

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);