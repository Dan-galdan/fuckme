import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  computedAt: Date;
  lessonIds: mongoose.Types.ObjectId[];
  rationale: string;
}

const RecommendationSchema = new Schema<IRecommendation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  computedAt: { type: Date, required: true },
  lessonIds: [{ type: Schema.Types.ObjectId, ref: 'Lesson', required: true }],
  rationale: { type: String, required: true }
});

export const Recommendation = mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
