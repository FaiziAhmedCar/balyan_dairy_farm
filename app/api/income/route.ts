import { NextRequest, NextResponse } from 'next/server';
import { Income, IncomeCategory, PaymentMethod } from '../../../app/types/income';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const INCOME_FILE = path.join(DATA_DIR, 'income.json');

function ensureDataDirectory(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // Only create income file if it doesn't exist
    if (!fs.existsSync(INCOME_FILE)) {
      fs.writeFileSync(INCOME_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error ensuring data directory:', error);
  }
}

function getIncomeFromFile(): Income[] {
  try {
    if (fs.existsSync(INCOME_FILE)) {
      const data = fs.readFileSync(INCOME_FILE, 'utf-8');
      const income = JSON.parse(data);
      return Array.isArray(income) ? income : [];
    }
    return [];
  } catch (error) {
    console.error('Error reading income from file:', error);
    return [];
  }
}

function saveIncomeToFile(income: Income[]): void {
  try {
    fs.writeFileSync(INCOME_FILE, JSON.stringify(income, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving income to file:', error);
  }
}

// GET /api/income - Get all income
export async function GET() {
  try {
    ensureDataDirectory();
    const income = getIncomeFromFile();
    return NextResponse.json(income.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  } catch (error) {
    console.error('Error fetching income:', error);
    return NextResponse.json({ error: 'Failed to fetch income' }, { status: 500 });
  }
}

// POST /api/income - Create new income
export async function POST(request: NextRequest) {
  try {
    ensureDataDirectory();
    const incomeData = await request.json();
    
    const income = getIncomeFromFile();
    const newIncome: Income = {
      ...incomeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    income.push(newIncome);
    saveIncomeToFile(income);
    
    return NextResponse.json(newIncome, { status: 201 });
  } catch (error) {
    console.error('Error creating income:', error);
    return NextResponse.json({ error: 'Failed to create income' }, { status: 500 });
  }
}

// PUT /api/income - Update income
export async function PUT(request: NextRequest) {
  try {
    ensureDataDirectory();
    const { id, ...updates } = await request.json();
    
    const income = getIncomeFromFile();
    const index = income.findIndex(item => item.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }
    
    income[index] = {
      ...income[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    saveIncomeToFile(income);
    return NextResponse.json(income[index]);
  } catch (error) {
    console.error('Error updating income:', error);
    return NextResponse.json({ error: 'Failed to update income' }, { status: 500 });
  }
}

// DELETE /api/income - Delete income
export async function DELETE(request: NextRequest) {
  try {
    ensureDataDirectory();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Income ID is required' }, { status: 400 });
    }
    
    const income = getIncomeFromFile();
    const index = income.findIndex(item => item.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }
    
    income.splice(index, 1);
    saveIncomeToFile(income);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting income:', error);
    return NextResponse.json({ error: 'Failed to delete income' }, { status: 500 });
  }
}
