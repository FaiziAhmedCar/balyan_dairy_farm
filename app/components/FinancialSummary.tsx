"use client";

import { Expense, ExpenseCategory } from "../types/expense";
import { Income, IncomeCategory } from "../types/income";

interface FinancialSummaryProps {
  expenses: Expense[];
  income: Income[];
}

const expenseCategoryLabels = {
  [ExpenseCategory.FEED]: "Feed",
  [ExpenseCategory.MEDICINE]: "Medicine",
  [ExpenseCategory.DOCTOR]: "Doctor",
  [ExpenseCategory.LABOR]: "Labor",
  [ExpenseCategory.MAINTENANCE]: "Maintenance",
  [ExpenseCategory.OTHER]: "Other",
};

const incomeCategoryLabels = {
  [IncomeCategory.MILK_SALE]: "Milk Sale",
  [IncomeCategory.CALF_SALE]: "Calf Sale",
  [IncomeCategory.MANURE_SALE]: "Manure Sale",
  [IncomeCategory.GOVERNMENT_SUBSIDY]: "Government Subsidy",
  [IncomeCategory.OTHER]: "Other",
};

export default function FinancialSummary({
  expenses,
  income,
}: FinancialSummaryProps) {
  // Calculate total expenses by category
  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    },
    {} as Record<ExpenseCategory, number>,
  );

  // Calculate total income by category
  const incomeByCategory = income.reduce(
    (acc, inc) => {
      acc[inc.category] = (acc[inc.category] || 0) + inc.amount;
      return acc;
    },
    {} as Record<IncomeCategory, number>,
  );

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
  const netEarnings = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black">
        Financial Summary
      </h2>

      {/* Overall Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm sm:text-lg font-semibold text-blue-800 mb-1 sm:mb-2">
            Total Income
          </h3>
          <p className="text-lg sm:text-2xl font-bold text-blue-600">
            {formatCurrency(totalIncome)}
          </p>
        </div>

        <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
          <h3 className="text-sm sm:text-lg font-semibold text-red-800 mb-1 sm:mb-2">
            Total Expenses
          </h3>
          <p className="text-lg sm:text-2xl font-bold text-red-600">
            {formatCurrency(totalExpenses)}
          </p>
        </div>

        <div
          className={`${netEarnings >= 0 ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"} p-3 sm:p-4 rounded-lg border`}
        >
          <h3
            className={`text-sm sm:text-lg font-semibold ${netEarnings >= 0 ? "text-green-800" : "text-orange-800"} mb-1 sm:mb-2`}
          >
            Net Earnings
          </h3>
          <p
            className={`text-lg sm:text-2xl font-bold ${netEarnings >= 0 ? "text-green-600" : "text-orange-600"}`}
          >
            {formatCurrency(netEarnings)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Expenses by Category */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
            Expenses by Category
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <div
                key={category}
                className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  {expenseCategoryLabels[category as ExpenseCategory]}
                </span>
                <span className="font-semibold text-red-600 text-sm sm:text-base">
                  {formatCurrency(amount)}
                </span>
              </div>
            ))}
            {Object.keys(expensesByCategory).length === 0 && (
              <p className="text-gray-500 text-center py-3 sm:py-4 text-sm sm:text-base">
                No expenses recorded
              </p>
            )}
          </div>
        </div>

        {/* Income by Category */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
            Income by Category
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {Object.entries(incomeByCategory).map(([category, amount]) => (
              <div
                key={category}
                className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  {incomeCategoryLabels[category as IncomeCategory]}
                </span>
                <span className="font-semibold text-green-600 text-sm sm:text-base">
                  {formatCurrency(amount)}
                </span>
              </div>
            ))}
            {Object.keys(incomeByCategory).length === 0 && (
              <p className="text-gray-500 text-center py-3 sm:py-4 text-sm sm:text-base">
                No income recorded
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Profit/Loss Indicator */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-800">
              Business Status
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {netEarnings > 0
                ? "Your dairy business is profitable! 🎉"
                : netEarnings < 0
                  ? "Your dairy business is running at a loss. ⚠️"
                  : "Your dairy business is breaking even. 📊"}
            </p>
          </div>
          <div
            className={`text-2xl sm:text-3xl ${netEarnings >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {netEarnings > 0 ? "📈" : netEarnings < 0 ? "📉" : "➖"}
          </div>
        </div>
      </div>
    </div>
  );
}
