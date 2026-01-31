import mongoose, { Schema, Document } from 'mongoose';
import { IncomeCategory, PaymentMethod } from '../types/income';

export interface IIncome extends Document {
  id: string;
  date: string;
  category: IncomeCategory;
  description: string;
  amount: number;
  quantity?: number;
  unit?: string;
  customer?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const IncomeSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  category: { type: String, required: true, enum: Object.values(IncomeCategory) },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  quantity: { type: Number },
  unit: { type: String },
  customer: { type: String },
  paymentMethod: { type: String, required: true, enum: Object.values(PaymentMethod) },
  notes: { type: String },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
}, {
  timestamps: false, // We're managing timestamps manually
});

export default mongoose.models.Income || mongoose.model<IIncome>('Income', IncomeSchema);
