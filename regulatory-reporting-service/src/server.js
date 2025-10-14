const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'Regulatory Reporting Service',
    status: 'running', 
    timestamp: new Date().toISOString() 
  });
});

// Mock regulatory reports
let reports = [
  { 
    id: 1, 
    reportId: 'REP001',
    type: 'AML',
    title: 'Anti-Money Laundering Report',
    status: 'submitted',
    period: '2024-Q1',
    submittedDate: new Date().toISOString()
  },
  { 
    id: 2, 
    reportId: 'REP002',
    type: 'KYC',
    title: 'Know Your Customer Report',
    status: 'pending',
    period: '2024-Q1',
    submittedDate: null
  }
];

let complianceChecks = [
  {
    id: 1,
    checkId: 'CHK001',
    type: 'transaction-monitoring',
    status: 'passed',
    timestamp: new Date().toISOString()
  }
];

// Get all reports
app.get('/reports', (req, res) => {
  res.json({ success: true, data: reports });
});

// Get report by ID
app.get('/reports/:id', (req, res) => {
  const report = reports.find(r => r.id === parseInt(req.params.id));
  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }
  res.json({ success: true, data: report });
});

// Generate new report
app.post('/reports', (req, res) => {
  const newReport = {
    id: reports.length + 1,
    reportId: `REP${String(reports.length + 1).padStart(3, '0')}`,
    ...req.body,
    status: 'generating',
    submittedDate: null,
    timestamp: new Date().toISOString()
  };
  
  reports.push(newReport);
  res.status(201).json({ success: true, data: newReport });
});

// Get all compliance checks
app.get('/compliance-checks', (req, res) => {
  res.json({ success: true, data: complianceChecks });
});

// Run compliance check
app.post('/compliance-checks', (req, res) => {
  const newCheck = {
    id: complianceChecks.length + 1,
    checkId: `CHK${String(complianceChecks.length + 1).padStart(3, '0')}`,
    ...req.body,
    status: 'running',
    timestamp: new Date().toISOString()
  };
  
  // Simulate compliance check
  setTimeout(() => {
    newCheck.status = 'passed';
  }, 2000);
  
  complianceChecks.push(newCheck);
  res.status(201).json({ success: true, data: newCheck });
});

app.listen(PORT, () => {
  console.log(`Regulatory Reporting Service running on port ${PORT}`);
});
