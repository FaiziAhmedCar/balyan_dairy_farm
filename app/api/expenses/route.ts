import { NextRequest, NextResponse } from "next/server";
import {
  Expense,
  ExpenseCategory,
  PaymentMethod,
} from "../../../app/types/expense";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

// Sample data for demonstration
const sampleExpenses: Expense[] = [
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

const DATA_DIR = path.join(process.cwd(), "data");
const EXPENSES_FILE = path.join(DATA_DIR, "expenses.json");

function ensureDataDirectory(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Only create expenses file if it doesn't exist, but don't add sample data
    if (!fs.existsSync(EXPENSES_FILE)) {
      // Create empty file instead of populating with sample data
      fs.writeFileSync(EXPENSES_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Error ensuring data directory:", error);
  }
}

function getExpensesFromFile(): Expense[] {
  try {
    if (fs.existsSync(EXPENSES_FILE)) {
      const data = fs.readFileSync(EXPENSES_FILE, "utf-8");
      const expenses = JSON.parse(data);
      return Array.isArray(expenses) ? expenses : [];
    }
    // Return empty array if file doesn't exist
    return [];
  } catch (error) {
    console.error("Error reading expenses from file:", error);
    return [];
  }
}

function saveExpensesToFile(expenses: Expense[]): void {
  try {
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify(expenses, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving expenses to file:", error);
  }
}

// GET /api/expenses - Get all expenses
export async function GET() {
  try {
    ensureDataDirectory();
    const expenses = getExpensesFromFile();
    return NextResponse.json(
      expenses.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    );
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 },
    );
  }
}

// POST /api/expenses - Create new expense
export async function POST(request: NextRequest) {
  try {
    ensureDataDirectory();
    const expenseData = await request.json();

    const expenses = getExpensesFromFile();
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expenses.push(newExpense);
    saveExpensesToFile(expenses);

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 },
    );
  }
}

// PUT /api/expenses - Update expense
export async function PUT(request: NextRequest) {
  try {
    ensureDataDirectory();
    const { id, ...updates } = await request.json();

    const expenses = getExpensesFromFile();
    const index = expenses.findIndex((expense) => expense.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    expenses[index] = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveExpensesToFile(expenses);
    return NextResponse.json(expenses[index]);
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 },
    );
  }
}

// DELETE /api/expenses - Delete expense
export async function DELETE(request: NextRequest) {
  try {
    ensureDataDirectory();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 },
      );
    }

    const expenses = getExpensesFromFile();
    const index = expenses.findIndex((expense) => expense.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    expenses.splice(index, 1);
    saveExpensesToFile(expenses);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 },
    );
  }
}
