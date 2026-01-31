import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../app/lib/mongoose";
import Income from "../../../app/models/Income";

// GET /api/income - Get all income
export async function GET() {
  try {
    await connectDB();
    const income = await Income.find({}).sort({ date: -1 });

    return NextResponse.json(income);
  } catch (error) {
    console.error("Error fetching income:", error);
    return NextResponse.json(
      { error: "Failed to fetch income" },
      { status: 500 },
    );
  }
}

// POST /api/income - Create new income
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const incomeData = await request.json();

    const newIncome = new Income({
      ...incomeData,
      id: Date.now().toString(), // Keep string ID for frontend compatibility
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const savedIncome = await newIncome.save();

    return NextResponse.json(savedIncome, { status: 201 });
  } catch (error) {
    console.error("Error creating income:", error);
    return NextResponse.json(
      { error: "Failed to create income" },
      { status: 500 },
    );
  }
}

// PUT /api/income - Update income
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { id, ...updates } = await request.json();

    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedIncome = await Income.findOneAndUpdate(
      { id: id },
      { $set: updateData },
      { new: true },
    );

    if (!updatedIncome) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    return NextResponse.json(updatedIncome);
  } catch (error) {
    console.error("Error updating income:", error);
    return NextResponse.json(
      { error: "Failed to update income" },
      { status: 500 },
    );
  }
}

// DELETE /api/income - Delete income
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Income ID is required" },
        { status: 400 },
      );
    }

    const deletedIncome = await Income.findOneAndDelete({ id: id });

    if (!deletedIncome) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting income:", error);
    return NextResponse.json(
      { error: "Failed to delete income" },
      { status: 500 },
    );
  }
}
