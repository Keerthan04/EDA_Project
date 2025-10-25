// src/controllers/payment.controller.ts
import { Request, Response } from "express";
import { PaymentOrchestratorService } from "../services/payment.orchestrator.js";
import { Transaction } from "../models/transaction.model.js";

const orchestrator = new PaymentOrchestratorService();

export const processNewPayment = async (req: Request, res: Response) => {
  try {
    const paymentDetails = req.body;
    console.log("Received payment details:", paymentDetails);
    if (
      !paymentDetails.amount ||
      !paymentDetails.payer ||
      !paymentDetails.payee
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment details" });
    }

    const result = await orchestrator.processUpiPayment(paymentDetails);

    if (result.status === "SUCCESS") {
      res.status(201).json({ success: true, data: result });
    } else {
      res
        .status(500)
        .json({
          success: false,
          message: "Payment processing failed",
          data: result,
        });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findOne({
      transactionId: req.params.transactionId,
    });
    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }
    res.json({ success: true, status: transaction.status, data: transaction });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
