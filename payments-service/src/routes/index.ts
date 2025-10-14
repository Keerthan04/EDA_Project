// src/routes/index.ts
import { Router } from "express";
import {
  processNewPayment,
  getPaymentStatus,
} from "../controllers/payment.controller";

const router = Router();

// Health check from your existing server.js
router.get("/health", (req, res) => {
  res.json({
    service: "Payments Service",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

router.post("/payments", processNewPayment);
router.get("/payments/:transactionId/status", getPaymentStatus);

export default router;
