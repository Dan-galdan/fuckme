import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  status: 'inactive' | 'active' | 'past_due' | 'canceled';
  planId?: string;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['inactive', 'active', 'past_due', 'canceled'], 
    default: 'inactive' 
  },
  planId: { type: String },
  currentPeriodEnd: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

SubscriptionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
