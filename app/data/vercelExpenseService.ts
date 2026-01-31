import { Expense } from '../types/expense';

// Vercel-compatible expense service using serverless storage
export class VercelExpenseService {
  private readonly API_BASE = '/api/expenses';

  async getAllExpenses(): Promise<Expense[]> {
    try {
      const response = await fetch(this.API_BASE);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    try {
      const response = await fetch(`${this.API_BASE}?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch expense');
      }
      const expenses = await response.json();
      return Array.isArray(expenses) ? expenses.find(expense => expense.id === id) || null : null;
    } catch (error) {
      console.error('Error fetching expense:', error);
      return null;
    }
  }

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create expense');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  }

  async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense | null> {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update expense');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }

  async deleteExpense(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }

  async getExpensesByCategory(category: string): Promise<Expense[]> {
    try {
      const expenses = await this.getAllExpenses();
      return expenses.filter(expense => expense.category === category);
    } catch (error) {
      console.error('Error fetching expenses by category:', error);
      return [];
    }
  }

  async getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    try {
      const expenses = await this.getAllExpenses();
      return expenses.filter(expense => 
        expense.date >= startDate && expense.date <= endDate
      );
    } catch (error) {
      console.error('Error fetching expenses by date range:', error);
      return [];
    }
  }

  // Export to Excel file
  async exportToExcel(): Promise<void> {
    try {
      const response = await fetch('/api/expenses/export');
      
      if (!response.ok) {
        throw new Error('Failed to export expenses');
      }
      
      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `balyan_dairy_farm_expenses_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }

  // Export to JSON for backup
  async exportExpenses(): Promise<string> {
    try {
      const expenses = await this.getAllExpenses();
      return JSON.stringify(expenses, null, 2);
    } catch (error) {
      console.error('Error exporting expenses:', error);
      throw error;
    }
  }

  // Import from JSON
  async importExpenses(jsonData: string): Promise<boolean> {
    try {
      const expenses: Expense[] = JSON.parse(jsonData);
      if (Array.isArray(expenses)) {
        // Clear existing expenses and import new ones
        for (const expense of expenses) {
          await this.createExpense(expense);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing expenses:', error);
      return false;
    }
  }

  async clearAllExpenses(): Promise<void> {
    try {
      const expenses = await this.getAllExpenses();
      for (const expense of expenses) {
        await this.deleteExpense(expense.id);
      }
    } catch (error) {
      console.error('Error clearing expenses:', error);
      throw error;
    }
  }

  // Get file info (simulated since we're using API)
  async getFileInfo() {
    try {
      const expenses = await this.getAllExpenses();
      return {
        fileName: 'expenses.json',
        filePath: '/api/expenses',
        totalRecords: expenses.length,
        lastUpdated: expenses.length > 0 
          ? Math.max(...expenses.map((e: Expense) => new Date(e.updatedAt).getTime()))
          : null,
        fileModified: new Date().getTime()
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      return {
        fileName: 'expenses.json',
        filePath: '/api/expenses',
        totalRecords: 0,
        lastUpdated: null,
        fileModified: null
      };
    }
  }
}
