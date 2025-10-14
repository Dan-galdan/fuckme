import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
  title: string;
  slug: string;
  grade: string;
  topics: string[];
  difficulty: number;
  contentUrl?: string;
  contentUrls?: string[];
  type: 'video' | 'reading' | 'exercise';
  isPublished: boolean;
  createdAt: Date;
}

const LessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  grade: { type: String, enum: ['6', '7', '8', '9', '10', '11', '12', 'EESH'], required: true },
  topics: { type: [String], required: true },
  difficulty: { type: Number, required: true, min: 1, max: 5 },
  contentUrl: { type: String },
  contentUrls: { type: [String] },
  type: { type: String, enum: ['video', 'reading', 'exercise'], required: true },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Lesson = mongoose.model<ILesson>('Lesson', LessonSchema);
