export interface Expense {
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

export enum ExpenseCategory {
  FEED = 'feed',
  MEDICINE = 'medicine',
  VETERINARY = 'veterinary',
  EQUIPMENT = 'equipment',
  LABOR = 'labor',
  UTILITIES = 'utilities',
  MAINTENANCE = 'maintenance',
  TRANSPORTATION = 'transportation',
  INSURANCE = 'insurance',
  TAXES = 'taxes',
  OTHER = 'other'
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  CHECK = 'check'
}

export interface ExpenseReport {
  totalExpenses: number;
  expensesByCategory: Record<ExpenseCategory, number>;
  expensesByMonth: Record<string, number>;
  recentExpenses: Expense[];
  period: {
    start: string;
    end: string;
  };
}

export interface ExpenseFilters {
  category?: ExpenseCategory;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  supplier?: string;
  paymentMethod?: PaymentMethod;
}
