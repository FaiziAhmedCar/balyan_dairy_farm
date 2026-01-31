import { Expense, ExpenseCategory, PaymentMethod } from "../types/expense";
import fs from "fs";
import path from "path";

// Sample data for demonstration
export const sampleExpenses: Expense[] = [
  {
    id: "1",
    date: "2024-01-15",
    category: ExpenseCategory.FEED,
    description: "Cattle feed purchase",
    amount: 250000,
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
    amount: 85000,
    supplier: "Veterinary Pharma",
    paymentMethod: PaymentMethod.CASH,
    notes: "Quarterly vaccine supply",
    createdAt: "2024-01-18T14:30:00Z",
    updatedAt: "2024-01-18T14:30:00Z",
  },
  {
    id: "3",
    date: "2024-01-20",
    category: ExpenseCategory.DOCTOR,
    description: "Regular health checkup",
    amount: 30000,
    supplier: "Dr. Smith Veterinary Clinic",
    paymentMethod: PaymentMethod.CREDIT_CARD,
    notes: "Monthly checkup for all cattle",
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
];

// File-based expense service
export class FileExpenseService {
  private readonly DATA_DIR = path.join(process.cwd(), "data");
  private readonly EXPENSES_FILE = path.join(this.DATA_DIR, "expenses.json");

  constructor() {
    this.ensureDataDirectory();
  }

  private ensureDataDirectory(): void {
    try {
      if (!fs.existsSync(this.DATA_DIR)) {
        fs.mkdirSync(this.DATA_DIR, { recursive: true });
      }

      // Create expenses file if it doesn't exist
      if (!fs.existsSync(this.EXPENSES_FILE)) {
        this.saveExpensesToFileSync(sampleExpenses);
      }
    } catch (error) {
      console.error("Error ensuring data directory:", error);
    }
  }

  private getExpensesFromFileSync(): Expense[] {
    try {
      if (fs.existsSync(this.EXPENSES_FILE)) {
        const data = fs.readFileSync(this.EXPENSES_FILE, "utf-8");
        const expenses = JSON.parse(data);
        return Array.isArray(expenses) ? expenses : [];
      }
      return sampleExpenses;
    } catch (error) {
      console.error("Error reading expenses from file:", error);
      return sampleExpenses;
    }
  }

  private saveExpensesToFileSync(expenses: Expense[]): void {
    try {
      fs.writeFileSync(
        this.EXPENSES_FILE,
        JSON.stringify(expenses, null, 2),
        "utf-8",
      );
    } catch (error) {
      console.error("Error saving expenses to file:", error);
    }
  }

  async getAllExpenses(): Promise<Expense[]> {
    const expenses = this.getExpensesFromFileSync();
    return expenses.sort(
      (a: Expense, b: Expense) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    const expenses = this.getExpensesFromFileSync();
    return expenses.find((expense: Expense) => expense.id === id) || null;
  }

  async createExpense(
    expense: Omit<Expense, "id" | "createdAt" | "updatedAt">,
  ): Promise<Expense> {
    const expenses = this.getExpensesFromFileSync();
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expenses.push(newExpense);
    this.saveExpensesToFileSync(expenses);
    return newExpense;
  }

  async updateExpense(
    id: string,
    updates: Partial<Expense>,
  ): Promise<Expense | null> {
    const expenses = this.getExpensesFromFileSync();
    const index = expenses.findIndex((expense: Expense) => expense.id === id);
    if (index === -1) return null;

    expenses[index] = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveExpensesToFileSync(expenses);
    return expenses[index];
  }

  async deleteExpense(id: string): Promise<boolean> {
    const expenses = this.getExpensesFromFileSync();
    const index = expenses.findIndex((expense: Expense) => expense.id === id);
    if (index === -1) return false;

    expenses.splice(index, 1);
    this.saveExpensesToFileSync(expenses);
    return true;
  }

  async getExpensesByCategory(category: ExpenseCategory): Promise<Expense[]> {
    const expenses = this.getExpensesFromFileSync();
    return expenses.filter((expense: Expense) => expense.category === category);
  }

  async getExpensesByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Expense[]> {
    const expenses = this.getExpensesFromFileSync();
    return expenses.filter(
      (expense: Expense) =>
        expense.date >= startDate && expense.date <= endDate,
    );
  }

  // Excel file operations
  async downloadExcelFile(): Promise<void> {
    // This would be implemented client-side since file download needs browser context
    throw new Error("Excel download should be handled client-side");
  }

  async uploadExcelFile(): Promise<boolean> {
    // This would be implemented client-side since file upload needs browser context
    throw new Error("Excel upload should be handled client-side");
  }

  // Export to JSON for backup
  async exportExpenses(): Promise<string> {
    const expenses = this.getExpensesFromFileSync();
    return JSON.stringify(expenses, null, 2);
  }

  // Import from JSON
  async importExpenses(jsonData: string): Promise<boolean> {
    try {
      const expenses: Expense[] = JSON.parse(jsonData);
      if (Array.isArray(expenses)) {
        this.saveExpensesToFileSync(expenses);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error importing expenses:", error);
      return false;
    }
  }

  async clearAllExpenses(): Promise<void> {
    this.saveExpensesToFileSync([]);
  }

  async getDataSize(): Promise<number> {
    try {
      if (fs.existsSync(this.EXPENSES_FILE)) {
        const stats = fs.statSync(this.EXPENSES_FILE);
        return stats.size;
      }
      return 0;
    } catch {
      return 0;
    }
  }

  // Get file info
  async getFileInfo() {
    try {
      const expenses = this.getExpensesFromFileSync();
      let lastModified = null;

      if (fs.existsSync(this.EXPENSES_FILE)) {
        const stats = fs.statSync(this.EXPENSES_FILE);
        lastModified = stats.mtime.getTime();
      }

      return {
        fileName: "expenses.json",
        filePath: this.EXPENSES_FILE,
        totalRecords: expenses.length,
        lastUpdated:
          expenses.length > 0
            ? Math.max(
                ...expenses.map((e: Expense) =>
                  new Date(e.updatedAt).getTime(),
                ),
              )
            : null,
        fileModified: lastModified,
      };
    } catch (error) {
      console.error("Error getting file info:", error);
      return {
        fileName: "expenses.json",
        filePath: this.EXPENSES_FILE,
        totalRecords: 0,
        lastUpdated: null,
        fileModified: null,
      };
    }
  }

  // Backup operations
  async createBackup(backupPath?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const defaultBackupPath = path.join(
      this.DATA_DIR,
      `expenses-backup-${timestamp}.json`,
    );
    const finalBackupPath = backupPath || defaultBackupPath;

    try {
      fs.copyFileSync(this.EXPENSES_FILE, finalBackupPath);
      return finalBackupPath;
    } catch (error) {
      console.error("Error creating backup:", error);
      throw error;
    }
  }

  async restoreFromBackup(backupPath: string): Promise<boolean> {
    try {
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, this.EXPENSES_FILE);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error restoring from backup:", error);
      return false;
    }
  }

  // Get all backup files
  async getBackupFiles(): Promise<string[]> {
    try {
      const files = fs.readdirSync(this.DATA_DIR);
      return files
        .filter(
          (file: string) =>
            file.startsWith("expenses-backup-") && file.endsWith(".json"),
        )
        .map((file: string) => path.join(this.DATA_DIR, file))
        .sort((a: string, b: string) => b.localeCompare(a)); // Sort by newest first
    } catch {
      return [];
    }
  }
}
