const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'Partner Integration Service',
    status: 'running', 
    timestamp: new Date().toISOString() 
  });
});

// Mock partner data
let partners = [
  { 
    id: 1, 
    name: 'Payment Gateway Inc', 
    type: 'payment-gateway',
    status: 'active',
    apiEndpoint: 'https://api.paymentgateway.example.com'
  },
  { 
    id: 2, 
    name: 'Credit Bureau Services', 
    type: 'credit-bureau',
    status: 'active',
    apiEndpoint: 'https://api.creditbureau.example.com'
  }
];

let integrations = [
  {
    id: 1,
    partnerId: 1,
    transactionId: 'INT001',
    type: 'payment',
    status: 'success',
    timestamp: new Date().toISOString()
  }
];

// Get all partners
app.get('/partners', (req, res) => {
  res.json({ success: true, data: partners });
});

// Get partner by ID
app.get('/partners/:id', (req, res) => {
  const partner = partners.find(p => p.id === parseInt(req.params.id));
  if (!partner) {
    return res.status(404).json({ success: false, message: 'Partner not found' });
  }
  res.json({ success: true, data: partner });
});

// Get all integrations
app.get('/integrations', (req, res) => {
  res.json({ success: true, data: integrations });
});

// Create new integration request
app.post('/integrations', (req, res) => {
  const newIntegration = {
    id: integrations.length + 1,
    transactionId: `INT${String(integrations.length + 1).padStart(3, '0')}`,
    ...req.body,
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  
  // Simulate integration processing
  setTimeout(() => {
    newIntegration.status = 'success';
  }, 1500);
  
  integrations.push(newIntegration);
  res.status(201).json({ success: true, data: newIntegration });
});

// Get integration status
app.get('/integrations/:id/status', (req, res) => {
  const integration = integrations.find(i => i.id === parseInt(req.params.id));
  if (!integration) {
    return res.status(404).json({ success: false, message: 'Integration not found' });
  }
  res.json({ success: true, status: integration.status });
});

app.listen(PORT, () => {
  console.log(`Partner Integration Service running on port ${PORT}`);
});
