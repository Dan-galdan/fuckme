import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  stem: string;
  kind: 'mcq' | 'numeric' | 'short_text';
  options?: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    imageUrl?: string; // ✅ Make sure this exists
  }>;
  answerKey: any;
  topics: string[];
  difficulty: number;
  imageUrl?: string; // ✅ Make sure this exists for question images
  grade: string;
  subject: string;
}

const QuestionSchema = new Schema<IQuestion>({
  stem: { type: String, required: true },
  kind: { type: String, enum: ['mcq', 'numeric', 'short_text'], required: true },
  options: [{
    id: { type: String, required: true },
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    imageUrl: { type: String } // ✅ Make sure this exists
  }],
  answerKey: { type: Schema.Types.Mixed, required: true },
  topics: [{ type: String, required: true }],
  difficulty: { type: Number, required: true, min: 1, max: 5 },
  imageUrl: { type: String }, // ✅ Make sure this exists
  grade: { type: String, required: true },
  subject: { type: String, required: true }
});

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);