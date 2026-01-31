import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { Expense } from '../../../../app/types/expense';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const EXPENSES_FILE = path.join(DATA_DIR, 'expenses.json');

function getExpensesFromFile(): Expense[] {
  try {
    if (fs.existsSync(EXPENSES_FILE)) {
      const data = fs.readFileSync(EXPENSES_FILE, 'utf-8');
      const expenses = JSON.parse(data);
      return Array.isArray(expenses) ? expenses : [];
    }
    return [];
  } catch (error) {
    console.error('Error reading expenses from file:', error);
    return [];
  }
}

function convertToWorksheet(expenses: Expense[]): XLSX.WorkSheet {
  const data = expenses.map(expense => ({
    ID: expense.id,
    Date: expense.date,
    Category: expense.category,
    Description: expense.description,
    Amount: expense.amount,
    Quantity: expense.quantity || '',
    Unit: expense.unit || '',
    Supplier: expense.supplier || '',
    PaymentMethod: expense.paymentMethod,
    Notes: expense.notes || '',
    CreatedAt: expense.createdAt,
    UpdatedAt: expense.updatedAt
  }));
  
  return XLSX.utils.json_to_sheet(data);
}

// GET /api/expenses/export - Export expenses to Excel
export async function GET() {
  try {
    const expenses = getExpensesFromFile();
    
    if (expenses.length === 0) {
      return NextResponse.json({ error: 'No expenses to export' }, { status: 404 });
    }

    // Create worksheet
    const worksheet = convertToWorksheet(expenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Create response with proper headers for file download
    const response = new NextResponse(excelBuffer);
    response.headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.headers.set('Content-Disposition', `attachment; filename="balyan_dairy_farm_expenses_${new Date().toISOString().split('T')[0]}.xlsx"`);
    
    return response;
  } catch (error) {
    console.error('Error exporting expenses:', error);
    return NextResponse.json({ error: 'Failed to export expenses' }, { status: 500 });
  }
}
