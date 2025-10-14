const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'Customer Service',
    status: 'running', 
    timestamp: new Date().toISOString() 
  });
});

// Mock customer data
let customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', accountNumber: 'ACC001' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', accountNumber: 'ACC002' }
];

// Get all customers
app.get('/customers', (req, res) => {
  res.json({ success: true, data: customers });
});

// Get customer by ID
app.get('/customers/:id', (req, res) => {
  const customer = customers.find(c => c.id === parseInt(req.params.id));
  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }
  res.json({ success: true, data: customer });
});

// Create new customer
app.post('/customers', (req, res) => {
  const newCustomer = {
    id: customers.length + 1,
    ...req.body,
    accountNumber: `ACC${String(customers.length + 1).padStart(3, '0')}`
  };
  customers.push(newCustomer);
  res.status(201).json({ success: true, data: newCustomer });
});

// Update customer
app.put('/customers/:id', (req, res) => {
  const index = customers.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }
  customers[index] = { ...customers[index], ...req.body, id: customers[index].id };
  res.json({ success: true, data: customers[index] });
});

// Delete customer
app.delete('/customers/:id', (req, res) => {
  const index = customers.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }
  customers.splice(index, 1);
  res.json({ success: true, message: 'Customer deleted' });
});

app.listen(PORT, () => {
  console.log(`Customer Service running on port ${PORT}`);
});
