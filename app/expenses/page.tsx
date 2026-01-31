"use client";

import { useState, useEffect, useCallback } from "react";
import { Expense } from "../types/expense";
import { ApiExpenseService } from "../data/apiExpenseService";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseReport from "../components/ExpenseReport";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "report">("list");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [expenseService] = useState(new ApiExpenseService());

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadExpenses = useCallback(async () => {
    if (!mounted) return;

    try {
      setLoading(true);
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
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

  const handleExportExcel = async () => {
    try {
      await expenseService.exportToExcel();
    } catch (error) {
      console.error("Failed to export Excel:", error);
      alert("Failed to export Excel file. Please try again.");
    }
  };

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
              className={`px-4 py-2 rounded-r-lg font-medium transition-colors ${
                activeTab === "report"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Reports
            </button>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add Expense
          </button>

          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Excel
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
        ) : (
          <ExpenseReport expenses={expenses} />
        )}
      </div>
    </div>
  );
}
