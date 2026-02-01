"use client";

import { Expense, ExpenseCategory, PaymentMethod } from "../types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const categoryLabels = {
  [ExpenseCategory.FEED]: "Feed",
  [ExpenseCategory.MEDICINE]: "Medicine",
  [ExpenseCategory.DOCTOR]: "Doctor",
  [ExpenseCategory.LABOR]: "Labor",
  [ExpenseCategory.MAINTENANCE]: "Maintenance",
  [ExpenseCategory.OTHER]: "Other",
};

const paymentMethodLabels = {
  [PaymentMethod.CASH]: "Cash",
  [PaymentMethod.BANK_TRANSFER]: "Bank Transfer",
  [PaymentMethod.CREDIT_CARD]: "Credit Card",
  [PaymentMethod.CHECK]: "Check",
};

const categoryColors = {
  [ExpenseCategory.FEED]: "bg-green-100 text-green-800",
  [ExpenseCategory.MEDICINE]: "bg-red-100 text-red-800",
  [ExpenseCategory.DOCTOR]: "bg-blue-100 text-blue-800",
  [ExpenseCategory.LABOR]: "bg-yellow-100 text-yellow-800",
  [ExpenseCategory.MAINTENANCE]: "bg-orange-100 text-orange-800",
  [ExpenseCategory.OTHER]: "bg-gray-100 text-gray-800",
};

export default function ExpenseList({
  expenses,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 text-center">
        <div className="text-gray-500 text-base sm:text-lg">
          No expenses found
        </div>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Start by adding your first expense
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="hidden sm:table-cell px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="hidden md:table-cell px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="hidden lg:table-cell px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                  {formatDate(expense.date)}
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${categoryColors[expense.category]}`}
                  >
                    {categoryLabels[expense.category]}
                  </span>
                </td>
                <td className="hidden sm:table-cell px-3 sm:px-4 lg:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                  <div
                    className="max-w-xs truncate"
                    title={expense.description}
                  >
                    {expense.description}
                  </div>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-red-600">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="hidden md:table-cell px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                  {paymentMethodLabels[expense.paymentMethod]}
                </td>
                <td className="hidden lg:table-cell px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                  {expense.supplier || "-"}
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  <div className="flex justify-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                      title="Edit"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="text-red-600 hover:text-red-800 transition-colors p-1"
                      title="Delete"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
