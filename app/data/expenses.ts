import { Expense, ExpenseCategory, PaymentMethod } from "../types/expense";

// Sample data for demonstration
export const sampleExpenses: Expense[] = [
  {
    id: "1",
    date: "2024-01-15",
    category: ExpenseCategory.FEED,
    description: "Cattle feed purchase",
    amount: 250000, // ₹2,50,000
    quantity: 500,
    unit: "kg",
    supplier: "Green Feed Supplies",
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    notes: "Monthly feed supply",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    date: "2024-01-18",
    category: ExpenseCategory.MEDICINE,
    description: "Vaccines and medications",
    amount: 85000, // ₹85,000
    supplier: "Veterinary Pharma",
    paymentMethod: PaymentMethod.CASH,
    notes: "Quarterly vaccine supply",
    createdAt: "2024-01-18T14:30:00Z",
    updatedAt: "2024-01-18T14:30:00Z",
  },
  {
    id: "3",
    date: "2024-01-20",
    category: ExpenseCategory.VETERINARY,
    description: "Regular health checkup",
    amount: 30000, // ₹30,000
    supplier: "Dr. Smith Veterinary Clinic",
    paymentMethod: PaymentMethod.CREDIT_CARD,
    notes: "Monthly checkup for all cattle",
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "4",
    date: "2024-01-22",
    category: ExpenseCategory.EQUIPMENT,
    description: "Milking machine maintenance",
    amount: 45000, // ₹45,000
    supplier: "Dairy Equipment Services",
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    notes: "Preventive maintenance",
    createdAt: "2024-01-22T11:00:00Z",
    updatedAt: "2024-01-22T11:00:00Z",
  },
  {
    id: "5",
    date: "2024-01-25",
    category: ExpenseCategory.LABOR,
    description: "Monthly wages",
    amount: 350000, // ₹3,50,000
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    notes: "Staff salaries for January",
    createdAt: "2024-01-25T16:00:00Z",
    updatedAt: "2024-01-25T16:00:00Z",
  },
  {
    id: "6",
    date: "2024-01-28",
    category: ExpenseCategory.UTILITIES,
    description: "Electricity bill",
    amount: 68000, // ₹68,000
    supplier: "Power Company",
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    notes: "Monthly electricity consumption",
    createdAt: "2024-01-28T12:00:00Z",
    updatedAt: "2024-01-28T12:00:00Z",
  },
];

// LocalStorage-based expense service
export class ExpenseService {
  private readonly STORAGE_KEY = "balyan_dairy_farm_expenses";

  private getExpensesFromStorage(): Expense[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        // Initialize with sample data on first load
        this.saveExpensesToStorage(sampleExpenses);
        return sampleExpenses;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return sampleExpenses;
    }
  }

  private saveExpensesToStorage(expenses: Expense[]): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  async getAllExpenses(): Promise<Expense[]> {
    const expenses = this.getExpensesFromStorage();
    return expenses.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    const expenses = this.getExpensesFromStorage();
    return expenses.find((expense) => expense.id === id) || null;
  }

  async createExpense(
    expense: Omit<Expense, "id" | "createdAt" | "updatedAt">,
  ): Promise<Expense> {
    const expenses = this.getExpensesFromStorage();
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expenses.push(newExpense);
    this.saveExpensesToStorage(expenses);
    return newExpense;
  }

  async updateExpense(
    id: string,
    updates: Partial<Expense>,
  ): Promise<Expense | null> {
    const expenses = this.getExpensesFromStorage();
    const index = expenses.findIndex((expense) => expense.id === id);
    if (index === -1) return null;

    expenses[index] = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveExpensesToStorage(expenses);
    return expenses[index];
  }

  async deleteExpense(id: string): Promise<boolean> {
    const expenses = this.getExpensesFromStorage();
    const index = expenses.findIndex((expense) => expense.id === id);
    if (index === -1) return false;

    expenses.splice(index, 1);
    this.saveExpensesToStorage(expenses);
    return true;
  }

  async getExpensesByCategory(category: ExpenseCategory): Promise<Expense[]> {
    const expenses = this.getExpensesFromStorage();
    return expenses.filter((expense) => expense.category === category);
  }

  async getExpensesByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Expense[]> {
    const expenses = this.getExpensesFromStorage();
    return expenses.filter(
      (expense) => expense.date >= startDate && expense.date <= endDate,
    );
  }

  // Utility methods for data management
  async exportExpenses(): Promise<string> {
    const expenses = this.getExpensesFromStorage();
    return JSON.stringify(expenses, null, 2);
  }

  async importExpenses(jsonData: string): Promise<boolean> {
    try {
      const expenses: Expense[] = JSON.parse(jsonData);
      // Validate the imported data
      if (Array.isArray(expenses)) {
        this.saveExpensesToStorage(expenses);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error importing expenses:", error);
      return false;
    }
  }

  async clearAllExpenses(): Promise<void> {
    this.saveExpensesToStorage([]);
  }

  getStorageSize(): number {
    if (typeof window === "undefined") return 0;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? stored.length : 0;
    } catch {
      return 0;
    }
  }
}
