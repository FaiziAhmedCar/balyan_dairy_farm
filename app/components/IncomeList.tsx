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

export default function IncomeList({ income, onEdit, onDelete }: IncomeListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-black mb-6">Income Records</h2>
        
        {income.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No income records yet</p>
            <p className="text-gray-400 mt-2">Start by adding your first income entry</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {income.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{formatDate(item.date)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${categoryColors[item.category]}`}>
                        {categoryLabels[item.category]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{item.description}</td>
                    <td className="py-3 px-4 text-gray-600">{item.customer || '-'}</td>
                    <td className="py-3 px-4 text-right font-semibold text-green-600">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {paymentMethodLabels[item.paymentMethod]}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
