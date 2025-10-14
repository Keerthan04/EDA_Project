const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'Core Banking Adapter',
    status: 'running', 
    timestamp: new Date().toISOString() 
  });
});

// Mock core banking data
let accounts = [
  { 
    id: 1, 
    accountNumber: 'ACC001',
    customerId: 1,
    balance: 50000.00,
    currency: 'USD',
    accountType: 'savings',
    status: 'active'
  },
  { 
    id: 2, 
    accountNumber: 'ACC002',
    customerId: 2,
    balance: 25000.00,
    currency: 'USD',
    accountType: 'checking',
    status: 'active'
  }
];

let transactions = [
  {
    id: 1,
    transactionId: 'TXN001',
    accountNumber: 'ACC001',
    type: 'debit',
    amount: 100.00,
    balance: 50000.00,
    timestamp: new Date().toISOString()
  }
];

// Get all accounts
app.get('/accounts', (req, res) => {
  res.json({ success: true, data: accounts });
});

// Get account by account number
app.get('/accounts/:accountNumber', (req, res) => {
  const account = accounts.find(a => a.accountNumber === req.params.accountNumber);
  if (!account) {
    return res.status(404).json({ success: false, message: 'Account not found' });
  }
  res.json({ success: true, data: account });
});

// Get account balance
app.get('/accounts/:accountNumber/balance', (req, res) => {
  const account = accounts.find(a => a.accountNumber === req.params.accountNumber);
  if (!account) {
    return res.status(404).json({ success: false, message: 'Account not found' });
  }
  res.json({ 
    success: true, 
    accountNumber: account.accountNumber,
    balance: account.balance,
    currency: account.currency 
  });
});

// Get account transactions
app.get('/accounts/:accountNumber/transactions', (req, res) => {
  const accountTransactions = transactions.filter(t => t.accountNumber === req.params.accountNumber);
  res.json({ success: true, data: accountTransactions });
});

// Post transaction (debit/credit)
app.post('/transactions', (req, res) => {
  const { accountNumber, type, amount } = req.body;
  
  const account = accounts.find(a => a.accountNumber === accountNumber);
  if (!account) {
    return res.status(404).json({ success: false, message: 'Account not found' });
  }
  
  // Update balance
  if (type === 'debit') {
    if (account.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient funds' });
    }
    account.balance -= amount;
  } else if (type === 'credit') {
    account.balance += amount;
  }
  
  const newTransaction = {
    id: transactions.length + 1,
    transactionId: `TXN${String(transactions.length + 1).padStart(3, '0')}`,
    accountNumber,
    type,
    amount,
    balance: account.balance,
    timestamp: new Date().toISOString()
  };
  
  transactions.push(newTransaction);
  res.status(201).json({ success: true, data: newTransaction });
});

app.listen(PORT, () => {
  console.log(`Core Banking Adapter running on port ${PORT}`);
});
