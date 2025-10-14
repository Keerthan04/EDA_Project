// src/services/payment.orchestrator.ts
import { Transaction, ITransaction } from "../models/transaction.model";
import { CBSAdapterClient } from "./cbs.adapter.client";
import { NPCIClient } from "./npci.client"; // Mock NPCI client
import { v4 as uuidv4 } from "uuid";

export class PaymentOrchestratorService {
  private cbsClient: CBSAdapterClient;
  private npciClient: NPCIClient;

  constructor() {
    this.cbsClient = new CBSAdapterClient();
    this.npciClient = new NPCIClient();
  }

  async processUpiPayment(paymentDetails: any): Promise<ITransaction> {
    const transaction = new Transaction({
      transactionId: uuidv4(),
      ...paymentDetails,
      status: "PENDING",
      orchestrationLog: [],
    });

    await this.logStep(transaction, "PaymentInitiated", "SUCCESS");

    try {
      // 1. Request Balance Hold from CBS Adapter
      const hold = await this.cbsClient.requestBalanceHold(
        transaction.payer.accountId,
        transaction.amount
      );
      if (!hold.success) {
        throw new Error(hold.message || "Insufficient funds");
      }
      await this.logStep(transaction, "BalanceHold", "SUCCESS");

      // 2. Send transaction to NPCI Switch
      const npciResponse = await this.npciClient.sendToSwitch(
        transaction.transactionId
      );
      if (!npciResponse.success) {
        // Here you would add logic to reverse the hold
        throw new Error("NPCI transaction failed");
      }
      await this.logStep(transaction, "NPCIConfirmation", "SUCCESS");

      // 3. Finalize Debit with CBS Adapter
      const debit = await this.cbsClient.finalizeDebit(
        transaction.payer.accountId,
        transaction.amount
      );
      if (!debit.success) {
        // Critical error: requires manual intervention
        throw new Error("Failed to finalize debit");
      }
      await this.logStep(transaction, "FinalizeDebit", "SUCCESS");

      // 4. Mark transaction as complete
      transaction.status = "SUCCESS";
      transaction.timestamps.completedAt = new Date();
      await this.logStep(transaction, "PaymentCompleted", "SUCCESS");
    } catch (error: any) {
      transaction.status = "FAILED";
      const failedStep =
        transaction.orchestrationLog[transaction.orchestrationLog.length - 1]
          ?.step || "Unknown";
      transaction.failureDetails = { reason: error.message, failedStep };
      await this.logStep(
        transaction,
        "PaymentFailed",
        "FAILURE",
        error.message
      );
    }

    transaction.timestamps.updatedAt = new Date();
    await transaction.save();
    return transaction;
  }

  private async logStep(
    transaction: ITransaction,
    step: string,
    status: "SUCCESS" | "FAILURE",
    details?: string
  ) {
    transaction.orchestrationLog.push({
      timestamp: new Date(),
      step,
      status,
      details: details !== undefined ? details : "no details",
    });
  }
}
