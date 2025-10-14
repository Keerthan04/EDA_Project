// src/services/npci.client.ts

// This is a mock client to simulate interactions with the NPCI/UPI network.
export class NPCIClient {
  /**
   * Simulates sending a transaction to the NPCI switch for processing.
   * In a real system, this would involve a secure network call.
   */
  async sendToSwitch(
    transactionId: string
  ): Promise<{ success: boolean; message: string }> {
    console.log(
      `[NPCIClient] Sending transaction ${transactionId} to UPI switch...`
    );

    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate a high success rate (e.g., 95% success)
        const isSuccessful = Math.random() > 0.05;

        if (isSuccessful) {
          console.log(
            `[NPCIClient] Received SUCCESS confirmation for ${transactionId}`
          );
          resolve({ success: true, message: "Transaction confirmed by NPCI" });
        } else {
          console.error(
            `[NPCIClient] Received FAILURE confirmation for ${transactionId}`
          );
          resolve({
            success: false,
            message: "Transaction declined by NPCI switch",
          });
        }
      }, 1500); // 1.5-second delay
    });
  }
}
