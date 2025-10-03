export interface PaymentProvider {
  createSession(input: { 
    userId: string; 
    amount: number; 
    currency: string; 
    planId?: string; 
  }): Promise<{ 
    sessionId: string; 
    payUrl?: string; 
    qrPayload?: any; 
  }>;
  
  verifyWebhook(rawBody: string, headers: Record<string, string>): { 
    ok: boolean; 
    externalRef?: string; 
  };
  
  fetchStatus(sessionId: string): Promise<"pending" | "paid" | "failed">;
}
