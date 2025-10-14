const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway is running', timestamp: new Date().toISOString() });
});

// Proxy configurations for microservices
const services = {
  customer: process.env.CUSTOMER_SERVICE_URL || 'http://customer-service:3001',
  payments: process.env.PAYMENTS_SERVICE_URL || 'http://payments-service:3002',
  partner: process.env.PARTNER_SERVICE_URL || 'http://partner-integration-service:3003',
  regulatory: process.env.REGULATORY_SERVICE_URL || 'http://regulatory-reporting-service:3004',
  corebanking: process.env.CORE_BANKING_SERVICE_URL || 'http://core-banking-adapter:3005'
};

// Setup proxies for each service
app.use('/api/customers', createProxyMiddleware({
  target: services.customer,
  changeOrigin: true,
  pathRewrite: { '^/api/customers': '' }
}));

app.use('/api/payments', createProxyMiddleware({
  target: services.payments,
  changeOrigin: true,
  pathRewrite: { '^/api/payments': '' }
}));

app.use('/api/partners', createProxyMiddleware({
  target: services.partner,
  changeOrigin: true,
  pathRewrite: { '^/api/partners': '' }
}));

app.use('/api/regulatory', createProxyMiddleware({
  target: services.regulatory,
  changeOrigin: true,
  pathRewrite: { '^/api/regulatory': '' }
}));

app.use('/api/core-banking', createProxyMiddleware({
  target: services.corebanking,
  changeOrigin: true,
  pathRewrite: { '^/api/core-banking': '' }
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Proxying to services:', services);
});
