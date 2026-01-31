import { NextRequest, NextResponse } from "next/server";
import {
  Expense,
  ExpenseCategory,
  PaymentMethod,
} from "../../../app/types/expense";

// In-memory storage for Vercel serverless environment
let expenses: Expense[] = [];

// Initialize with sample data if empty
if (expenses.length === 0) {
  expenses = [
    {
      id: "1",
      date: "2026-01-31",
      category: ExpenseCategory.FEED,
      description: "best in this world",
      amount: 500,
      quantity: 10,
      unit: "kg",
      supplier: "ramu",
      paymentMethod: PaymentMethod.CASH,
      notes: "gk glnniun;h  ",
      createdAt: "2026-01-31T19:15:50.207Z",
      updatedAt: "2026-01-31T19:15:50.207Z",
    },
  ];
}

// GET /api/expenses - Get all expenses
export async function GET() {
  try {
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
    const expenseData = await request.json();

    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expenses.push(newExpense);

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
    const { id, ...updates } = await request.json();

    const index = expenses.findIndex((expense) => expense.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    expenses[index] = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 },
      );
    }

    const index = expenses.findIndex((expense) => expense.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    expenses.splice(index, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 },
    );
  }
}
