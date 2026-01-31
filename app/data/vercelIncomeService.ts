import { Income } from '../types/income';

// Vercel-compatible income service using serverless storage
export class VercelIncomeService {
  private readonly API_BASE = '/api/income';

  async getAllIncome(): Promise<Income[]> {
    try {
      const response = await fetch(this.API_BASE);
      if (!response.ok) {
        throw new Error('Failed to fetch income');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching income:', error);
      return [];
    }
  }

  async getIncomeById(id: string): Promise<Income | null> {
    try {
      const response = await fetch(`${this.API_BASE}?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch income');
      }
      const income = await response.json();
      return Array.isArray(income) ? income.find(item => item.id === id) || null : null;
    } catch (error) {
      console.error('Error fetching income:', error);
      return null;
    }
  }

  async createIncome(income: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>): Promise<Income> {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(income),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create income');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating income:', error);
      throw error;
    }
  }

  async updateIncome(id: string, updates: Partial<Income>): Promise<Income | null> {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update income');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating income:', error);
      throw error;
    }
  }

  async deleteIncome(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete income');
      }
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error deleting income:', error);
      throw error;
    }
  }

  async getIncomeByCategory(category: string): Promise<Income[]> {
    try {
      const income = await this.getAllIncome();
      return income.filter(item => item.category === category);
    } catch (error) {
      console.error('Error fetching income by category:', error);
      return [];
    }
  }

  async getIncomeByDateRange(startDate: string, endDate: string): Promise<Income[]> {
    try {
      const income = await this.getAllIncome();
      return income.filter(item => 
        item.date >= startDate && item.date <= endDate
      );
    } catch (error) {
      console.error('Error fetching income by date range:', error);
      return [];
    }
  }
}
