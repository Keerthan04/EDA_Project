'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface PaymentForm {
  type: string;
  amount: string;
  currency: string;
  fromAccount: string;
  toAccount: string;
  payerVpa?: string;
  payeeVpa?: string;
}

interface PaymentResponse {
  success: boolean;
  data?: any;
  status?: string;
  message?: string;
}

function PaymentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accountNumber = searchParams.get('accountNumber') || '';

  const [formData, setFormData] = useState<PaymentForm>({
    type: 'UPI',
    amount: '',
    currency: 'INR',
    fromAccount: accountNumber,
    toAccount: '',
    payerVpa: '',
    payeeVpa: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentResponse | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${apiGateway}/api/core-banking/accounts`);
      const data = await response.json();
      if (data.success) {
        setAccounts(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch accounts', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const paymentData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        payer: {
          accountId: formData.fromAccount,
          vpa: formData.payerVpa || `${formData.fromAccount}@okbank`
        },
        payee: {
          accountId: formData.toAccount,
          vpa: formData.payeeVpa || `${formData.toAccount}@okbank`
        }
      };

      const response = await fetch(`${apiGateway}/api/payments/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({
        success: false,
        message: 'Failed to process payment. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">Initiate Payment</h1>
              <p className="text-gray-600 text-sm">Process payments through microservices</p>
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
        <div className="max-w-2xl mx-auto">
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                >
                  <option value="UPI">UPI</option>
                  <option value="NEFT">NEFT</option>
                  <option value="RTGS">RTGS</option>
                  <option value="IMPS">IMPS</option>
                </select>
              </div>

              {/* From Account */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From Account
                </label>
                <input
                  type="text"
                  name="fromAccount"
                  value={formData.fromAccount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="ACC001"
                  required
                />
              </div>

              {/* To Account */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To Account
                </label>
                <select
                  name="toAccount"
                  value={formData.toAccount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                >
                  <option value="">Select account</option>
                  {accounts
                    .filter(acc => acc.accountNumber !== formData.fromAccount)
                    .map(acc => (
                      <option key={acc.id} value={acc.accountNumber}>
                        {acc.accountNumber} - {acc.accountType} ({acc.balance} {acc.currency})
                      </option>
                    ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    required
                  />
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              {/* VPA Fields (Optional) */}
              {formData.type === 'UPI' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payer VPA (Optional)
                    </label>
                    <input
                      type="text"
                      name="payerVpa"
                      value={formData.payerVpa}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="user@okbank"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payee VPA (Optional)
                    </label>
                    <input
                      type="text"
                      name="payeeVpa"
                      value={formData.payeeVpa}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="merchant@okbank"
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Process Payment'}
              </button>
            </form>
          </div>

          {/* Result */}
          {result && (
            <div className={`mt-6 rounded-lg shadow-lg p-6 ${
              result.success ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                  {result.success ? (
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.success ? 'Payment Successful' : 'Payment Failed'}
                  </h3>
                  {result.data && (
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><span className="font-semibold">Transaction ID:</span> {result.data.transactionId || result.data._id}</p>
                      <p><span className="font-semibold">Status:</span> {result.data.status || result.status}</p>
                      <p><span className="font-semibold">Amount:</span> {result.data.amount} {result.data.currency}</p>
                      {result.data.timestamp && (
                        <p><span className="font-semibold">Time:</span> {new Date(result.data.timestamp).toLocaleString()}</p>
                      )}
                    </div>
                  )}
                  {result.message && (
                    <p className="text-sm text-gray-700 mt-2">{result.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-2">How it works</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Your payment request goes through the API Gateway</li>
              <li>Payments Service orchestrates the transaction</li>
              <li>Core Banking Adapter verifies and holds funds</li>
              <li>External payment network processes the transfer</li>
              <li>Transaction is finalized and logged</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentsContent />
    </Suspense>
  );
}
