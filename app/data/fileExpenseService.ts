import { Expense, ExpenseCategory, PaymentMethod } from '../types/expense';
import fs from 'fs-extra';
import path from 'path';

// Sample data for demonstration
export const sampleExpenses: Expense[] = [
  {
    id: '1',
    date: '2024-01-15',
    category: ExpenseCategory.FEED,
    description: 'Cattle feed purchase',
    amount: 250000,
    quantity: 500,
    unit: 'kg',
    supplier: 'Green Feed Supplies',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    notes: 'Monthly feed supply',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    date: '2024-01-18',
    category: ExpenseCategory.MEDICINE,
    description: 'Vaccines and medications',
    amount: 85000,
    supplier: 'Veterinary Pharma',
    paymentMethod: PaymentMethod.CASH,
    notes: 'Quarterly vaccine supply',
    createdAt: '2024-01-18T14:30:00Z',
    updatedAt: '2024-01-18T14:30:00Z'
  },
  {
    id: '3',
    date: '2024-01-20',
    category: ExpenseCategory.DOCTOR,
    description: 'Regular health checkup',
    amount: 30000,
    supplier: 'Dr. Smith Veterinary Clinic',
    paymentMethod: PaymentMethod.CREDIT_CARD,
    notes: 'Monthly checkup for all cattle',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  }
];

// File-based expense service
export class FileExpenseService {
  private readonly DATA_DIR = path.join(process.cwd(), 'data');
  private readonly EXPENSES_FILE = path.join(this.DATA_DIR, 'expenses.json');

  constructor() {
    this.ensureDataDirectory();
  }

  private async ensureDataDirectory(): Promise<void> {
    try {
      await fs.ensureDir(this.DATA_DIR);
      
      // Create expenses file if it doesn't exist
      if (!await fs.pathExists(this.EXPENSES_FILE)) {
        await this.saveExpensesToFile(sampleExpenses);
      }
    } catch (error) {
      console.error('Error ensuring data directory:', error);
    }
  }

  private async getExpensesFromFile(): Promise<Expense[]> {
    try {
      if (await fs.pathExists(this.EXPENSES_FILE)) {
        const data = await fs.readJson(this.EXPENSES_FILE);
        return Array.isArray(data) ? data : [];
      }
      return sampleExpenses;
    } catch (error) {
      console.error('Error reading expenses from file:', error);
      return sampleExpenses;
    }
  }

  private async saveExpensesToFile(expenses: Expense[]): Promise<void> {
    try {
      await fs.writeJson(this.EXPENSES_FILE, expenses, { spaces: 2 });
    } catch (error) {
      console.error('Error saving expenses to file:', error);
    }
  }

  async getAllExpenses(): Promise<Expense[]> {
    const expenses = await this.getExpensesFromFile();
    return expenses.sort((a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    const expenses = await this.getExpensesFromFile();
    return expenses.find((expense: Expense) => expense.id === id) || null;
  }

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const expenses = await this.getExpensesFromFile();
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    expenses.push(newExpense);
    await this.saveExpensesToFile(expenses);
    return newExpense;
  }

  async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense | null> {
    const expenses = await this.getExpensesFromFile();
    const index = expenses.findIndex((expense: Expense) => expense.id === id);
    if (index === -1) return null;

    expenses[index] = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.saveExpensesToFile(expenses);
    return expenses[index];
  }

  async deleteExpense(id: string): Promise<boolean> {
    const expenses = await this.getExpensesFromFile();
    const index = expenses.findIndex((expense: Expense) => expense.id === id);
    if (index === -1) return false;

    expenses.splice(index, 1);
    await this.saveExpensesToFile(expenses);
    return true;
  }

  async getExpensesByCategory(category: ExpenseCategory): Promise<Expense[]> {
    const expenses = await this.getExpensesFromFile();
    return expenses.filter((expense: Expense) => expense.category === category);
  }

  async getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    const expenses = await this.getExpensesFromFile();
    return expenses.filter((expense: Expense) => 
      expense.date >= startDate && expense.date <= endDate
    );
  }

  // Excel file operations
  async downloadExcelFile(): Promise<void> {
    // This would be implemented client-side since file download needs browser context
    throw new Error('Excel download should be handled client-side');
  }

  async uploadExcelFile(fileData: any): Promise<boolean> {
    // This would be implemented client-side since file upload needs browser context
    throw new Error('Excel upload should be handled client-side');
  }

  // Export to JSON for backup
  async exportExpenses(): Promise<string> {
    const expenses = await this.getExpensesFromFile();
    return JSON.stringify(expenses, null, 2);
  }

  // Import from JSON
  async importExpenses(jsonData: string): Promise<boolean> {
    try {
      const expenses: Expense[] = JSON.parse(jsonData);
      if (Array.isArray(expenses)) {
        await this.saveExpensesToFile(expenses);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing expenses:', error);
      return false;
    }
  }

  async clearAllExpenses(): Promise<void> {
    await this.saveExpensesToFile([]);
  }

  async getDataSize(): Promise<number> {
    try {
      if (await fs.pathExists(this.EXPENSES_FILE)) {
        const stats = await fs.stat(this.EXPENSES_FILE);
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
      const expenses = await this.getExpensesFromFile();
      let lastModified = null;
      
      if (await fs.pathExists(this.EXPENSES_FILE)) {
        const stats = await fs.stat(this.EXPENSES_FILE);
        lastModified = stats.mtime.getTime();
      }
      
      return {
        fileName: 'expenses.json',
        filePath: this.EXPENSES_FILE,
        totalRecords: expenses.length,
        lastUpdated: expenses.length > 0 
          ? Math.max(...expenses.map((e: Expense) => new Date(e.updatedAt).getTime()))
          : null,
        fileModified: lastModified
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      return {
        fileName: 'expenses.json',
        filePath: this.EXPENSES_FILE,
        totalRecords: 0,
        lastUpdated: null,
        fileModified: null
      };
    }
  }

  // Backup operations
  async createBackup(backupPath?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultBackupPath = path.join(this.DATA_DIR, `expenses-backup-${timestamp}.json`);
    const finalBackupPath = backupPath || defaultBackupPath;
    
    try {
      await fs.copy(this.EXPENSES_FILE, finalBackupPath);
      return finalBackupPath;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  async restoreFromBackup(backupPath: string): Promise<boolean> {
    try {
      if (await fs.pathExists(backupPath)) {
        await fs.copy(backupPath, this.EXPENSES_FILE);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      return false;
    }
  }

  // Get all backup files
  async getBackupFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.DATA_DIR);
      return files
        .filter(file => file.startsWith('expenses-backup-') && file.endsWith('.json'))
        .map(file => path.join(this.DATA_DIR, file))
        .sort((a, b) => b.localeCompare(a)); // Sort by newest first
    } catch {
      return [];
    }
  }
}
