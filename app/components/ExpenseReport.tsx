"use client";

import { Expense, ExpenseCategory, type ExpenseReport } from "../types/expense";

interface ExpenseReportProps {
  expenses: Expense[];
}

export default function ExpenseReport({ expenses }: ExpenseReportProps) {
  const generateReport = (): ExpenseReport => {
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const expensesByCategory = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<ExpenseCategory, number>,
    );

    const expensesByMonth = expenses.reduce(
      (acc, expense) => {
        const month = expense.date.substring(0, 7); // YYYY-MM
        acc[month] = (acc[month] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const recentExpenses = expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    const sortedMonths = Object.keys(expensesByMonth).sort();
    const period = {
      start: sortedMonths[0] || "",
      end: sortedMonths[sortedMonths.length - 1] || "",
    };

    return {
      totalExpenses,
      expensesByCategory,
      expensesByMonth,
      recentExpenses,
      period,
    };
  };

  const report = generateReport();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const categoryLabels = {
    [ExpenseCategory.FEED]: "Feed",
    [ExpenseCategory.MEDICINE]: "Medicine",
    [ExpenseCategory.VETERINARY]: "Veterinary",
    [ExpenseCategory.EQUIPMENT]: "Equipment",
    [ExpenseCategory.LABOR]: "Labor",
    [ExpenseCategory.UTILITIES]: "Utilities",
    [ExpenseCategory.MAINTENANCE]: "Maintenance",
    [ExpenseCategory.TRANSPORTATION]: "Transportation",
    [ExpenseCategory.INSURANCE]: "Insurance",
    [ExpenseCategory.TAXES]: "Taxes",
    [ExpenseCategory.OTHER]: "Other",
  };

  const getCategoryPercentage = (category: ExpenseCategory) => {
    return report.totalExpenses > 0
      ? (
          ((report.expensesByCategory[category] || 0) / report.totalExpenses) *
          100
        ).toFixed(1)
      : "0";
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Expenses
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(report.totalExpenses)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {report.period.start && report.period.end
              ? `${report.period.start} to ${report.period.end}`
              : "No data available"}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Number of Transactions
          </h3>
          <p className="text-3xl font-bold text-green-600">{expenses.length}</p>
          <p className="text-sm text-gray-500 mt-2">Total recorded expenses</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Average Expense
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {formatCurrency(report.totalExpenses / expenses.length || 0)}
          </p>
          <p className="text-sm text-gray-500 mt-2">Per transaction</p>
        </div>
      </div>

      {/* Expenses by Category */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Expenses by Category
        </h3>
        <div className="space-y-3">
          {Object.entries(report.expensesByCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {categoryLabels[category as ExpenseCategory]}
                    </span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {formatCurrency(amount)} (
                      {getCategoryPercentage(category as ExpenseCategory)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${getCategoryPercentage(category as ExpenseCategory)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Monthly Expenses
        </h3>
        <div className="space-y-2">
          {Object.entries(report.expensesByMonth)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, amount]) => (
              <div
                key={month}
                className="flex justify-between items-center py-2 border-b border-gray-100"
              >
                <span className="text-sm text-gray-700">
                  {new Date(month + "-01").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(amount)}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Expenses
        </h3>
        <div className="space-y-2">
          {report.recentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {expense.description}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(expense.date).toLocaleDateString()} •{" "}
                  {categoryLabels[expense.category]}
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
