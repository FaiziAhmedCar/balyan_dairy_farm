import { Expense, ExpenseCategory, PaymentMethod } from "../types/expense";
import * as XLSX from "xlsx";

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
    category: ExpenseCategory.VETERINARY,
    description: "Regular health checkup",
    amount: 30000,
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
    amount: 45000,
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
    amount: 350000,
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
    amount: 68000,
    supplier: "Power Company",
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    notes: "Monthly electricity consumption",
    createdAt: "2024-01-28T12:00:00Z",
    updatedAt: "2024-01-28T12:00:00Z",
  },
];

// Excel-based expense service
export class ExcelExpenseService {
  private readonly EXCEL_FILE_NAME = "balyan_dairy_farm_expenses.xlsx";
  private readonly SHEET_NAME = "Expenses";

  private getExpensesFromExcel(): Expense[] {
    if (typeof window === "undefined") return [];

    try {
      // Try to get from localStorage first (for client-side)
      const storedData = localStorage.getItem(
        "balyan_dairy_farm_expenses_excel",
      );
      if (storedData) {
        return JSON.parse(storedData);
      }

      // Initialize with sample data
      this.saveExpensesToExcel(sampleExpenses);
      return sampleExpenses;
    } catch (error) {
      console.error("Error reading expenses:", error);
      return sampleExpenses;
    }
  }

  private saveExpensesToExcel(expenses: Expense[]): void {
    if (typeof window === "undefined") return;

    try {
      // Save to localStorage for persistence
      localStorage.setItem(
        "balyan_dairy_farm_expenses_excel",
        JSON.stringify(expenses),
      );
    } catch (error) {
      console.error("Error saving expenses:", error);
    }
  }

  private convertToWorksheet(expenses: Expense[]): XLSX.WorkSheet {
    const data = expenses.map((expense) => ({
      ID: expense.id,
      Date: expense.date,
      Category: expense.category,
      Description: expense.description,
      Amount: expense.amount,
      Quantity: expense.quantity || "",
      Unit: expense.unit || "",
      Supplier: expense.supplier || "",
      PaymentMethod: expense.paymentMethod,
      Notes: expense.notes || "",
      CreatedAt: expense.createdAt,
      UpdatedAt: expense.updatedAt,
    }));

    return XLSX.utils.json_to_sheet(data);
  }

  private convertFromWorksheet(worksheet: XLSX.WorkSheet): Expense[] {
    const data = XLSX.utils.sheet_to_json(worksheet) as Record<
      string,
      unknown
    >[];
    return data.map((row) => ({
      id: (row.ID as string) || "",
      date: (row.Date as string) || "",
      category: (row.Category as ExpenseCategory) || ExpenseCategory.OTHER,
      description: (row.Description as string) || "",
      amount: parseFloat((row.Amount as string) || "0") || 0,
      quantity: parseFloat((row.Quantity as string) || "0") || undefined,
      unit: (row.Unit as string) || undefined,
      supplier: (row.Supplier as string) || undefined,
      paymentMethod: (row.PaymentMethod as PaymentMethod) || PaymentMethod.CASH,
      notes: (row.Notes as string) || undefined,
      createdAt: (row.CreatedAt as string) || new Date().toISOString(),
      updatedAt: (row.UpdatedAt as string) || new Date().toISOString(),
    }));
  }

  async getAllExpenses(): Promise<Expense[]> {
    const expenses = this.getExpensesFromExcel();
    return expenses.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    const expenses = this.getExpensesFromExcel();
    return expenses.find((expense) => expense.id === id) || null;
  }

  async createExpense(
    expense: Omit<Expense, "id" | "createdAt" | "updatedAt">,
  ): Promise<Expense> {
    const expenses = this.getExpensesFromExcel();
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expenses.push(newExpense);
    this.saveExpensesToExcel(expenses);
    return newExpense;
  }

  async updateExpense(
    id: string,
    updates: Partial<Expense>,
  ): Promise<Expense | null> {
    const expenses = this.getExpensesFromExcel();
    const index = expenses.findIndex((expense) => expense.id === id);
    if (index === -1) return null;

    expenses[index] = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveExpensesToExcel(expenses);
    return expenses[index];
  }

  async deleteExpense(id: string): Promise<boolean> {
    const expenses = this.getExpensesFromExcel();
    const index = expenses.findIndex((expense) => expense.id === id);
    if (index === -1) return false;

    expenses.splice(index, 1);
    this.saveExpensesToExcel(expenses);
    return true;
  }

  async getExpensesByCategory(category: ExpenseCategory): Promise<Expense[]> {
    const expenses = this.getExpensesFromExcel();
    return expenses.filter((expense) => expense.category === category);
  }

  async getExpensesByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Expense[]> {
    const expenses = this.getExpensesFromExcel();
    return expenses.filter(
      (expense) => expense.date >= startDate && expense.date <= endDate,
    );
  }

  // Excel file operations
  downloadExcelFile(): void {
    if (typeof window === "undefined") return;

    try {
      const expenses = this.getExpensesFromExcel();
      const worksheet = this.convertToWorksheet(expenses);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, this.SHEET_NAME);

      // Generate and download Excel file
      XLSX.writeFile(workbook, this.EXCEL_FILE_NAME);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  }

  async uploadExcelFile(file: File): Promise<boolean> {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[this.SHEET_NAME];

      if (!worksheet) {
        console.error("No expenses sheet found in Excel file");
        return false;
      }

      const expenses = this.convertFromWorksheet(worksheet);
      this.saveExpensesToExcel(expenses);
      return true;
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      return false;
    }
  }

  // Export to JSON for backup
  async exportExpenses(): Promise<string> {
    const expenses = this.getExpensesFromExcel();
    return JSON.stringify(expenses, null, 2);
  }

  // Import from JSON
  async importExpenses(jsonData: string): Promise<boolean> {
    try {
      const expenses: Expense[] = JSON.parse(jsonData);
      if (Array.isArray(expenses)) {
        this.saveExpensesToExcel(expenses);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error importing expenses:", error);
      return false;
    }
  }

  async clearAllExpenses(): Promise<void> {
    this.saveExpensesToExcel([]);
  }

  getDataSize(): number {
    if (typeof window === "undefined") return 0;

    try {
      const stored = localStorage.getItem("balyan_dairy_farm_expenses_excel");
      return stored ? stored.length : 0;
    } catch {
      return 0;
    }
  }

  // Get Excel file info
  getExcelFileInfo() {
    const expenses = this.getExpensesFromExcel();
    return {
      fileName: this.EXCEL_FILE_NAME,
      sheetName: this.SHEET_NAME,
      totalRecords: expenses.length,
      lastUpdated:
        expenses.length > 0
          ? Math.max(...expenses.map((e) => new Date(e.updatedAt).getTime()))
          : null,
    };
  }
}
