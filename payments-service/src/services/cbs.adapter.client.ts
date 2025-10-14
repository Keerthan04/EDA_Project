// src/services/cbs.adapter.client.ts
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const CBS_ADAPTER_URL =
  process.env.CORE_BANKING_SERVICE_URL || "http://core-banking-adapter:3005";

export class CBSAdapterClient {
  // Simulates placing a hold on funds
  async requestBalanceHold(
    accountId: string,
    amount: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // In a real system, this would be a specific endpoint for placing a lien
      const response = await axios.post(`${CBS_ADAPTER_URL}/transactions`, {
        accountNumber: accountId,
        type: "debit", // This simulates a hold by debiting
        amount: amount,
      });
      return { success: response.status === 201 };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to place hold",
      };
    }
  }

  // Simulates finalizing the debit after successful payment
  async finalizeDebit(
    accountId: string,
    amount: number
  ): Promise<{ success: boolean }> {
    // In a real system, this would confirm the previous hold.
    // Since our mock debits immediately, we'll just log this action.
    console.log(`Finalizing debit for ${accountId} of amount ${amount}`);
    return { success: true };
  }
}
