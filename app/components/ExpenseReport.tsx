"use client";

import { useState } from "react";
import { Expense, ExpenseCategory, type ExpenseReport } from "../types/expense";

interface ExpenseReportProps {
  expenses: Expense[];
}

type ReportPeriod = "daily" | "weekly" | "monthly" | "yearly";

interface PeriodData {
  period: string;
  amount: number;
  count: number;
  categories: Record<ExpenseCategory, number>;
}

export default function ExpenseReport({ expenses }: ExpenseReportProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>("monthly");

  const getPeriodKey = (date: string, period: ReportPeriod): string => {
    const d = new Date(date);
    switch (period) {
      case "daily":
        return date;
      case "weekly":
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        return weekStart.toISOString().substring(0, 10);
      case "monthly":
        return date.substring(0, 7); // YYYY-MM
      case "yearly":
        return date.substring(0, 4); // YYYY
      default:
        return date;
    }
  };

  const getPeriodLabel = (periodKey: string, period: ReportPeriod): string => {
    switch (period) {
      case "daily":
        return new Date(periodKey).toLocaleDateString();
      case "weekly":
        const weekStart = new Date(periodKey);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
      case "monthly":
        return new Date(periodKey + "-01").toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });
      case "yearly":
        return periodKey;
      default:
        return periodKey;
    }
  };

  const getPeriodData = (period: ReportPeriod): PeriodData[] => {
    const grouped = expenses.reduce(
      (acc, expense) => {
        const key = getPeriodKey(expense.date, period);
        if (!acc[key]) {
          acc[key] = {
            period: key,
            amount: 0,
            count: 0,
            categories: {} as Record<ExpenseCategory, number>,
          };
        }
        acc[key].amount += expense.amount;
        acc[key].count += 1;
        acc[key].categories[expense.category] =
          (acc[key].categories[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, PeriodData>,
    );

    return Object.values(grouped)
      .sort((a, b) => b.period.localeCompare(a.period))
      .slice(0, 12); // Show last 12 periods
  };

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
  const periodData = getPeriodData(selectedPeriod);

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
    [ExpenseCategory.DOCTOR]: "Doctor",
    [ExpenseCategory.LABOR]: "Labor",
    [ExpenseCategory.MAINTENANCE]: "Maintenance",
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

  const tabs = [
    { id: "daily" as ReportPeriod, label: "Daily", icon: "📅" },
    { id: "weekly" as ReportPeriod, label: "Weekly", icon: "📊" },
    { id: "monthly" as ReportPeriod, label: "Monthly", icon: "📈" },
    { id: "yearly" as ReportPeriod, label: "Yearly", icon: "📉" },
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector Tabs */}
      <div className="bg-white rounded-lg shadow-md p-2">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedPeriod(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                selectedPeriod === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            Transactions
          </h3>
          <p className="text-3xl font-bold text-green-600">{expenses.length}</p>
          <p className="text-sm text-gray-500 mt-2">Total recorded</p>
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {tabs.find((t) => t.id === selectedPeriod)?.label} Average
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {formatCurrency(
              periodData.length > 0
                ? periodData.reduce((sum, p) => sum + p.amount, 0) /
                    periodData.length
                : 0,
            )}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Per {selectedPeriod.slice(0, -2)}
          </p>
        </div>
      </div>

      {/* Period Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Period Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {tabs.find((t) => t.id === selectedPeriod)?.label} Trend
          </h3>
          <div className="space-y-3">
            {periodData.map((data) => (
              <div key={data.period} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {getPeriodLabel(data.period, selectedPeriod)}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(data.amount)}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({data.count} transactions)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-linear-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${periodData.length > 0 ? (data.amount / Math.max(...periodData.map((p) => p.amount))) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown for Selected Period */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Category Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(report.expensesByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {categoryLabels[category as ExpenseCategory]}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(amount)} (
                      {getCategoryPercentage(category as ExpenseCategory)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-linear-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${getCategoryPercentage(category as ExpenseCategory)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
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
