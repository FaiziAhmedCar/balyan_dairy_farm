"use client";

import { useState, useEffect, useCallback } from "react";
import { Expense, ExpenseCategory, PaymentMethod } from "../types/expense";
import { ExcelExpenseService } from "../data/excelExpenseService";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseReport from "../components/ExpenseReport";
import ExcelFileManager from "../components/ExcelFileManager";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "report" | "excel">(
    "list",
  );
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [expenseService] = useState(new ExcelExpenseService());

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadExpenses = useCallback(async () => {
    if (!mounted) return;

    try {
      setLoading(true);
      const data = await expenseService.getAllExpenses();

      // Initialize with sample data if no data exists
      if (data.length === 0) {
        const sampleData = [
          {
            date: "2024-01-15",
            category: ExpenseCategory.FEED,
            description: "Cattle feed purchase",
            amount: 250000,
            quantity: 500,
            unit: "kg",
            supplier: "Green Feed Supplies",
            paymentMethod: PaymentMethod.BANK_TRANSFER,
            notes: "Monthly feed supply",
          },
          {
            date: "2024-01-18",
            category: ExpenseCategory.MEDICINE,
            description: "Vaccines and medications",
            amount: 85000,
            supplier: "Veterinary Pharma",
            paymentMethod: PaymentMethod.CASH,
            notes: "Quarterly vaccine supply",
          },
          {
            date: "2024-01-20",
            category: ExpenseCategory.DOCTOR,
            description: "Regular health checkup",
            amount: 30000,
            supplier: "Dr. Smith Veterinary Clinic",
            paymentMethod: PaymentMethod.CREDIT_CARD,
            notes: "Monthly checkup for all cattle",
          },
        ];

        for (const expense of sampleData) {
          await expenseService.createExpense(expense);
        }

        const newData = await expenseService.getAllExpenses();
        setExpenses(newData);
      } else {
        setExpenses(data);
      }
    } catch (error) {
      console.error("Failed to load expenses:", error);
    } finally {
      setLoading(false);
    }
  }, [expenseService, mounted]);

  useEffect(() => {
    if (mounted) {
      loadExpenses();
    }
  }, [loadExpenses, mounted]);

  const handleAddExpense = async (
    expenseData: Omit<Expense, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      await expenseService.createExpense(expenseData);
      await loadExpenses();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  const handleEditExpense = async (
    expenseData: Omit<Expense, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (!editingExpense) return;

    try {
      await expenseService.updateExpense(editingExpense.id, expenseData);
      await loadExpenses();
      setEditingExpense(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      await expenseService.deleteExpense(id);
      await loadExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleDownloadExcel = () => {
    expenseService.downloadExcelFile();
  };

  const handleUploadExcel = async (file: File): Promise<boolean> => {
    const success = await expenseService.uploadExcelFile(file);
    if (success) {
      await loadExpenses();
    }
    return success;
  };

  const fileInfo = expenseService.getExcelFileInfo();

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dairy Farm Expenses
          </h1>
          <p className="mt-2 text-gray-600">
            Manage and track your dairy farm expenses
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-1 bg-white rounded-lg shadow">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-4 py-2 rounded-l-lg font-medium transition-colors ${
                activeTab === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab("report")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "report"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab("excel")}
              className={`px-4 py-2 rounded-r-lg font-medium transition-colors ${
                activeTab === "excel"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Excel
            </button>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add Expense
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ExpenseForm
                onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
                onCancel={handleCancelForm}
                initialData={editingExpense || undefined}
              />
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === "list" ? (
          <ExpenseList
            expenses={expenses}
            onEdit={handleEditClick}
            onDelete={handleDeleteExpense}
          />
        ) : activeTab === "report" ? (
          <ExpenseReport expenses={expenses} />
        ) : (
          <ExcelFileManager
            onDownloadExcel={handleDownloadExcel}
            onUploadExcel={handleUploadExcel}
            fileInfo={fileInfo}
          />
        )}
      </div>
    </div>
  );
}
