"use client";

import { Income, IncomeCategory, PaymentMethod } from "../types/income";

interface IncomeListProps {
  income: Income[];
  onEdit: (income: Income) => void;
  onDelete: (id: string) => void;
}

const categoryLabels = {
  [IncomeCategory.MILK_SALE]: "Milk Sale",
  [IncomeCategory.CALF_SALE]: "Calf Sale",
  [IncomeCategory.MANURE_SALE]: "Manure Sale",
  [IncomeCategory.GOVERNMENT_SUBSIDY]: "Government Subsidy",
  [IncomeCategory.OTHER]: "Other",
};

const categoryColors = {
  [IncomeCategory.MILK_SALE]: "bg-green-100 text-green-800",
  [IncomeCategory.CALF_SALE]: "bg-blue-100 text-blue-800",
  [IncomeCategory.MANURE_SALE]: "bg-yellow-100 text-yellow-800",
  [IncomeCategory.GOVERNMENT_SUBSIDY]: "bg-purple-100 text-purple-800",
  [IncomeCategory.OTHER]: "bg-gray-100 text-gray-800",
};

const paymentMethodLabels = {
  [PaymentMethod.CASH]: "Cash",
  [PaymentMethod.BANK_TRANSFER]: "Bank Transfer",
  [PaymentMethod.CREDIT_CARD]: "Credit Card",
  [PaymentMethod.UPI]: "UPI",
  [PaymentMethod.CHEQUE]: "Cheque",
};

export default function IncomeList({
  income,
  onEdit,
  onDelete,
}: IncomeListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
          Income Records
        </h2>

        {income.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-base sm:text-lg">
              No income records yet
            </p>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Start by adding your first income entry
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                    Date
                  </th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                    Category
                  </th>
                  <th className="hidden sm:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                    Description
                  </th>
                  <th className="hidden md:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                    Customer
                  </th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                    Amount
                  </th>
                  <th className="hidden lg:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                    Payment
                  </th>
                  <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {income.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 text-xs sm:text-sm">
                      {formatDate(item.date)}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${categoryColors[item.category]}`}
                      >
                        {categoryLabels[item.category]}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell py-2 sm:py-3 px-2 sm:px-4 text-gray-900 text-xs sm:text-sm">
                      <div
                        className="max-w-xs truncate"
                        title={item.description}
                      >
                        {item.description}
                      </div>
                    </td>
                    <td className="hidden md:table-cell py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm">
                      {item.customer || "-"}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-semibold text-green-600 text-xs sm:text-sm">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm">
                      {paymentMethodLabels[item.paymentMethod]}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex justify-center space-x-1 sm:space-x-2">
                        <button
                          onClick={() => onEdit(item)}
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
                          onClick={() => onDelete(item.id)}
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
        )}
      </div>
    </div>
  );
}
