import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  provider: 'mock' | 'qpay';
  status: 'pending' | 'paid' | 'failed';
  amount: number;
  currency: string;
  sessionId: string;
  externalRef?: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, enum: ['mock', 'qpay'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  sessionId: { type: String, required: true },
  externalRef: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
