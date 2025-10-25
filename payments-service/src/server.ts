// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3002;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ 
//     service: 'Payments Service',
//     status: 'running', 
//     timestamp: new Date().toISOString() 
//   });
// });

// // Mock payment data
// let payments = [
//   { 
//     id: 1, 
//     transactionId: 'TXN001', 
//     amount: 1000.00, 
//     currency: 'USD',
//     status: 'completed',
//     fromAccount: 'ACC001',
//     toAccount: 'ACC002',
//     timestamp: new Date().toISOString()
//   }
// ];

// // Get all payments
// app.get('/payments', (req, res) => {
//   res.json({ success: true, data: payments });
// });

// // Get payment by ID
// app.get('/payments/:id', (req, res) => {
//   const payment = payments.find(p => p.id === parseInt(req.params.id));
//   if (!payment) {
//     return res.status(404).json({ success: false, message: 'Payment not found' });
//   }
//   res.json({ success: true, data: payment });
// });

// // Process new payment
// app.post('/payments', (req, res) => {
//   const newPayment = {
//     id: payments.length + 1,
//     transactionId: `TXN${String(payments.length + 1).padStart(3, '0')}`,
//     ...req.body,
//     status: 'processing',
//     timestamp: new Date().toISOString()
//   };
  
//   // Simulate payment processing
//   setTimeout(() => {
//     newPayment.status = 'completed';
//   }, 2000);
  
//   payments.push(newPayment);
//   res.status(201).json({ success: true, data: newPayment });
// });

// // Get payment status
// app.get('/payments/:id/status', (req, res) => {
//   const payment = payments.find(p => p.id === parseInt(req.params.id));
//   if (!payment) {
//     return res.status(404).json({ success: false, message: 'Payment not found' });
//   }
//   res.json({ success: true, status: payment.status });
// });

// app.listen(PORT, () => {
//   console.log(`Payments Service running on port ${PORT}`);
// });


// src/server.ts
import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes/index.js'; // Import the centralized routes

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3002;
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/payments-service';

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// --- API Routes ---
app.use('/', routes); // Use the routes defined in src/routes/index.ts

// --- Database Connection ---
mongoose.connect(DATABASE_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    // Start the server only after a successful DB connection
    app.listen(PORT, () => {
      console.log(`Payments Service is running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit the process with a failure code
  });