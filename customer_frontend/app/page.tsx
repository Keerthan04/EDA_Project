'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Customer {
  id: number;
  name: string;
  email: string;
  accountNumber: string;
}

interface Account {
  id: number;
  accountNumber: string;
  customerId: number;
  balance: number;
  currency: string;
  accountType: string;
  status: string;
}

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkingBrokerage, setLinkingBrokerage] = useState(false);
  const [brokerageMessage, setBrokerageMessage] = useState<string | null>(null);

  const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000';

  // Fetch all customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiGateway}/api/customers/customers`);
      const data = await response.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (err) {
      setError('Failed to fetch customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountDetails = async (accountNumber: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${apiGateway}/api/core-banking/accounts/${accountNumber}`);
      const data = await response.json();
      if (data.success) {
        setAccount(data.data);
      } else {
        setError('Account not found');
      }
    } catch (err) {
      setError('Failed to fetch account details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setAccount(null);
    setError(null);
    setBrokerageMessage(null);
    fetchAccountDetails(customer.accountNumber);
  };

  const handleLinkBrokerage = async () => {
    if (!selectedCustomer) return;
    
    try {
      setLinkingBrokerage(true);
      setBrokerageMessage(null);
      
      const response = await fetch(`${apiGateway}/api/partners/integrations/link-brokerage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          brokerageAccountId: 'MOCK_BROKERAGE_123'
        }),
      });
      
      const data = await response.json();
      
      if (response.status === 201 && data.success) {
        if (data.data.status === 'linked') {
          setBrokerageMessage(`✓ Brokerage account linked successfully! Integration ID: ${data.data.transactionId}`);
        } else {
          setBrokerageMessage(`✗ Failed to link brokerage account. Status: ${data.data.status}`);
        }
      } else {
        setBrokerageMessage('✗ Failed to link brokerage account. Please try again.');
      }
    } catch (err) {
      console.error('Error linking brokerage:', err);
      setBrokerageMessage('✗ An error occurred while linking brokerage account.');
    } finally {
      setLinkingBrokerage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">Banking Portal</h1>
              <p className="text-gray-600 text-sm">Customer Microservices Dashboard</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Customer View</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Select Customer</h2>
              {loading && customers.length === 0 ? (
                <p className="text-gray-500">Loading customers...</p>
              ) : (
                <div className="space-y-2">
                  {customers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedCustomer?.id === customer.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-semibold text-gray-800">{customer.name}</p>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Account: {customer.accountNumber}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Customer Details & Account Info */}
          <div className="lg:col-span-2">
            {!selectedCustomer ? (
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Select a Customer
                </h3>
                <p className="text-gray-500">
                  Choose a customer from the list to view their account details and available actions
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Customer Information Card */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="text-lg font-semibold text-gray-800">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-lg font-semibold text-gray-800">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Account Number</p>
                      <p className="text-lg font-semibold text-gray-800">{selectedCustomer.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Customer ID</p>
                      <p className="text-lg font-semibold text-gray-800">#{selectedCustomer.id}</p>
                    </div>
                  </div>
                </div>

                {/* Account Balance Card */}
                {error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : account ? (
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Account Balance</h3>
                    <p className="text-4xl font-bold mb-1">
                      {account.currency} {account.balance.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <div>
                        <p className="text-sm opacity-80">Account Type</p>
                        <p className="font-semibold capitalize">{account.accountType}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-80">Status</p>
                        <p className="font-semibold capitalize">{account.status}</p>
                      </div>
                    </div>
                  </div>
                ) : loading ? (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <p className="text-gray-500">Loading account details...</p>
                  </div>
                ) : null}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href={`/payments?accountNumber=${selectedCustomer.accountNumber}`}
                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-600"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <svg
                          className="h-8 w-8 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Initiate Payment</h3>
                        <p className="text-sm text-gray-600">Transfer money or make a payment</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href={`/transactions?accountNumber=${selectedCustomer.accountNumber}`}
                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-600"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <svg
                          className="h-8 w-8 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">View Transactions</h3>
                        <p className="text-sm text-gray-600">Check transaction history</p>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Link External Accounts */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Link External Accounts</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect your external accounts to access integrated services
                  </p>
                  <button
                    onClick={handleLinkBrokerage}
                    disabled={linkingBrokerage}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {linkingBrokerage ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Linking...
                      </>
                    ) : (
                      'Link Brokerage Account'
                    )}
                  </button>
                  {brokerageMessage && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      brokerageMessage.includes('✓') 
                        ? 'bg-green-50 border border-green-200 text-green-800' 
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                      <p className="text-sm font-medium">{brokerageMessage}</p>
                    </div>
                  )}
                </div>

                {/* Services Info */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Available Services</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-gray-700">Customer Service</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-gray-700">Payments Service</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-gray-700">Core Banking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-gray-700">Partner Integration</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
