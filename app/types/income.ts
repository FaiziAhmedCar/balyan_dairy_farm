export enum IncomeCategory {
  MILK_SALE = 'milk_sale',
  CALF_SALE = 'calf_sale',
  MANURE_SALE = 'manure_sale',
  GOVERNMENT_SUBSIDY = 'government_subsidy',
  OTHER = 'other'
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  UPI = 'upi',
  CHEQUE = 'cheque'
}

export interface Income {
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
