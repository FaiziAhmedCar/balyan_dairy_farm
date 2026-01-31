import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../app/lib/mongoose";
import Expense from "../../../app/models/Expense";

// GET /api/expenses - Get all expenses
export async function GET() {
  try {
    await connectDB();
    const expenses = await Expense.find({}).sort({ date: -1 });

    return NextResponse.json(expenses);
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
    await connectDB();
    const expenseData = await request.json();

    const newExpense = new Expense({
      ...expenseData,
      id: Date.now().toString(), // Keep string ID for frontend compatibility
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const savedExpense = await newExpense.save();

    return NextResponse.json(savedExpense, { status: 201 });
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
    await connectDB();
    const { id, ...updates } = await request.json();

    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedExpense = await Expense.findOneAndUpdate(
      { id: id },
      { $set: updateData },
      { new: true },
    );

    if (!updatedExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(updatedExpense);
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
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 },
      );
    }

    const deletedExpense = await Expense.findOneAndDelete({ id: id });

    if (!deletedExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 },
    );
  }
}
