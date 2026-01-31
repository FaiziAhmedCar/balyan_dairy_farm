import mongoose, { Schema, Document } from 'mongoose';
import { ExpenseCategory, PaymentMethod } from '../types/expense';

export interface IExpense extends Document {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  quantity?: number;
  unit?: string;
  supplier?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const ExpenseSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  category: { type: String, required: true, enum: Object.values(ExpenseCategory) },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  quantity: { type: Number },
  unit: { type: String },
  supplier: { type: String },
  paymentMethod: { type: String, required: true, enum: Object.values(PaymentMethod) },
  notes: { type: String },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
}, {
  timestamps: false, // We're managing timestamps manually
});

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
