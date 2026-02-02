"use client";

import { useState, useEffect, useCallback } from "react";
import { Expense } from "../types/expense";
import { Income } from "../types/income";
import { ApiExpenseService } from "../data/apiExpenseService";
import { ApiIncomeService } from "../data/apiIncomeService";
import ExpenseForm from "../components/ExpenseForm";
import IncomeForm from "../components/IncomeForm";
import ExpenseList from "../components/ExpenseList";
import IncomeList from "../components/IncomeList";
import ExpenseReport from "../components/ExpenseReport";
import FinancialSummary from "../components/FinancialSummary";
import AuthGuard from "../components/AuthGuard";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [activeTab, setActiveTab] = useState<
    "expenses" | "income" | "summary" | "report"
  >("expenses");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [expenseService] = useState(new ApiExpenseService());
  const [incomeService] = useState(new ApiIncomeService());

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadExpenses = useCallback(async () => {
    if (!mounted) return;

    try {
      setLoading(true);
      const [expensesData, incomeData] = await Promise.all([
        expenseService.getAllExpenses(),
        incomeService.getAllIncome(),
      ]);
      setExpenses(expensesData);
      setIncome(incomeData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [expenseService, incomeService, mounted]);

  useEffect(() => {
    if (mounted) {
      loadExpenses();
    }
  }, [loadExpenses, mounted]);

  const handleAddExpense = async (
    expense: Omit<Expense, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      await expenseService.createExpense(expense);
      await loadExpenses();
      setShowExpenseForm(false);
    } catch (error) {
      console.error("Failed to add expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  const handleEditExpense = async (
    expense: Omit<Expense, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (!editingExpense) return;

    try {
      await expenseService.updateExpense(editingExpense.id, expense);
      await loadExpenses();
      setShowExpenseForm(false);
      setEditingExpense(null);
    } catch (error) {
      console.error("Failed to update expense:", error);
      alert("Failed to update expense. Please try again.");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      await expenseService.deleteExpense(id);
      await loadExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
      alert("Failed to delete expense. Please try again.");
    }
  };

  const handleAddIncome = async (
    income: Omit<Income, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      await incomeService.createIncome(income);
      await loadExpenses();
      setShowIncomeForm(false);
    } catch (error) {
      console.error("Failed to add income:", error);
      alert("Failed to add income. Please try again.");
    }
  };

  const handleEditIncome = async (
    income: Omit<Income, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (!editingIncome) return;

    try {
      await incomeService.updateIncome(editingIncome.id, income);
      await loadExpenses();
      setShowIncomeForm(false);
      setEditingIncome(null);
    } catch (error) {
      console.error("Failed to update income:", error);
      alert("Failed to update income. Please try again.");
    }
  };

  const handleDeleteIncome = async (id: string) => {
    if (!confirm("Are you sure you want to delete this income entry?")) return;

    try {
      await incomeService.deleteIncome(id);
      await loadExpenses();
    } catch (error) {
      console.error("Failed to delete income:", error);
      alert("Failed to delete income. Please try again.");
    }
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleEditIncomeClick = (income: Income) => {
    setEditingIncome(income);
    setShowIncomeForm(true);
  };

  const handleCancelExpenseForm = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  const handleCancelIncomeForm = () => {
    setShowIncomeForm(false);
    setEditingIncome(null);
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
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dairy Farm Management
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Track expenses, income, and calculate your earnings
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mb-4 sm:mb-6">
            {/* Tab Navigation */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex flex-wrap gap-1 bg-white rounded-lg shadow p-1">
                <button
                  onClick={() => setActiveTab("expenses")}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                    activeTab === "expenses"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Expenses
                </button>
                <button
                  onClick={() => setActiveTab("income")}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                    activeTab === "income"
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                    activeTab === "summary"
                      ? "bg-purple-600 text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setActiveTab("report")}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                    activeTab === "report"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Reports
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => setShowExpenseForm(true)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Add Expense</span>
                  <span className="sm:hidden">+ Expense</span>
                </button>
                <button
                  onClick={() => setShowIncomeForm(true)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Add Income</span>
                  <span className="sm:hidden">+ Income</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm sm:text-base flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
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
                  <span className="hidden sm:inline">Export Excel</span>
                  <span className="sm:hidden">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Forms */}
          {showExpenseForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <ExpenseForm
                  onSubmit={
                    editingExpense ? handleEditExpense : handleAddExpense
                  }
                  onCancel={handleCancelExpenseForm}
                  initialData={editingExpense || undefined}
                />
              </div>
            </div>
          )}

          {showIncomeForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <IncomeForm
                  onSubmit={editingIncome ? handleEditIncome : handleAddIncome}
                  onCancel={handleCancelIncomeForm}
                  initialData={editingIncome || undefined}
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="w-full overflow-x-auto">
            {activeTab === "expenses" ? (
              <ExpenseList
                expenses={expenses}
                onEdit={handleEditClick}
                onDelete={handleDeleteExpense}
              />
            ) : activeTab === "income" ? (
              <IncomeList
                income={income}
                onEdit={handleEditIncomeClick}
                onDelete={handleDeleteIncome}
              />
            ) : activeTab === "summary" ? (
              <FinancialSummary expenses={expenses} income={income} />
            ) : (
              <ExpenseReport expenses={expenses} />
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
