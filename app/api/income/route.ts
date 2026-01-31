import { NextRequest, NextResponse } from "next/server";
import { Income } from "../../../app/types/income";

// In-memory storage for Vercel serverless environment
const incomeRecords: Income[] = [];

// GET /api/income - Get all income
export async function GET() {
  try {
    return NextResponse.json(
      incomeRecords.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    );
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
    const incomeData = await request.json();

    const newIncome: Income = {
      ...incomeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    incomeRecords.push(newIncome);

    return NextResponse.json(newIncome, { status: 201 });
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
    const { id, ...updates } = await request.json();

    const index = incomeRecords.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    incomeRecords[index] = {
      ...incomeRecords[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(incomeRecords[index]);
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Income ID is required" },
        { status: 400 },
      );
    }

    const index = incomeRecords.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    incomeRecords.splice(index, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting income:", error);
    return NextResponse.json(
      { error: "Failed to delete income" },
      { status: 500 },
    );
  }
}
