// src/models/transaction.model.ts
import { Schema, model, Document } from "mongoose";

// Interface for the orchestration log steps
interface IOrchestrationLog {
  timestamp: Date;
  step: string;
  status: "SUCCESS" | "FAILURE";
  details?: string;
}

// Interface for the main transaction document
export interface ITransaction extends Document {
  transactionId: string;
  externalId?: string;
  type: "UPI" | "WALLET_TRANSFER";
  status: "PENDING" | "SUCCESS" | "FAILED" | "REVERSED";
  amount: number;
  currency: string;
  payer: { accountId: string; vpa?: string };
  payee: { accountId: string; vpa?: string };
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
  };
  orchestrationLog: IOrchestrationLog[];
  failureDetails?: {
    reason: string;
    failedAtStep: string;
  };
}

const transactionSchema = new Schema<ITransaction>({
  transactionId: { type: String, required: true, unique: true },
  externalId: { type: String },
  type: { type: String, required: true },
  status: { type: String, required: true, default: "PENDING" },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  payer: {
    accountId: { type: String, required: true },
    vpa: { type: String },
  },
  payee: {
    accountId: { type: String, required: true },
    vpa: { type: String },
  },
  timestamps: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  orchestrationLog: [
    {
      timestamp: Date,
      step: String,
      status: String,
      details: String,
    },
  ],
  failureDetails: {
    reason: String,
    failedAtStep: String,
  },
});

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
