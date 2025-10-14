'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Transaction {
  id: number;
  transactionId: string;
  accountNumber: string;
  type: string;
  amount: number;
  balance: number;
  timestamp: string;
}

function TransactionsContent() {
  const searchParams = useSearchParams();
  const accountNumber = searchParams.get('accountNumber') || '';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000';

  useEffect(() => {
    if (accountNumber) {
      fetchTransactions();
    }
  }, [accountNumber]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${apiGateway}/api/core-banking/accounts/${accountNumber}/transactions`
      );
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.data);
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">Transaction History</h1>
              <p className="text-gray-600 text-sm">
                Account: {accountNumber || 'Not specified'}
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!accountNumber ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800">
                No account number provided. Please select a customer from the dashboard.
              </p>
            </div>
          ) : loading ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <svg
                className="mx-auto h-24 w-24 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Transactions Found</h3>
              <p className="text-gray-500">
                There are no transactions for this account yet.
              </p>
            </div>
          ) : (
            <>
              {/* Summary Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Transaction Summary</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Transactions</p>
                    <p className="text-2xl font-bold text-indigo-600">{transactions.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Debits</p>
                    <p className="text-2xl font-bold text-red-600">
                      {transactions.filter(t => t.type === 'debit').length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Credits</p>
                    <p className="text-2xl font-bold text-green-600">
                      {transactions.filter(t => t.type === 'credit').length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800">All Transactions</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-full ${
                              transaction.type === 'debit'
                                ? 'bg-red-100'
                                : 'bg-green-100'
                            }`}
                          >
                            {transaction.type === 'debit' ? (
                              <svg
                                className="h-6 w-6 text-red-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="h-6 w-6 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              Transaction {transaction.transactionId}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(transaction.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              transaction.type === 'debit'
                                ? 'text-red-600'
                                : 'text-green-600'
                            }`}
                          >
                            {transaction.type === 'debit' ? '-' : '+'}
                            {transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Balance: {transaction.balance.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-2">Transaction Information</h3>
            <p className="text-sm text-blue-800">
              All transactions are retrieved from the Core Banking Adapter service, which maintains
              the ledger and account balances. Each transaction shows the type (debit/credit),
              amount, and the resulting balance after the transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionsContent />
    </Suspense>
  );
}
