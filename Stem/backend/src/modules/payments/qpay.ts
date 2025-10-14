import { PaymentProvider } from './provider.js';
import { env } from '../../config/env.js';

export class QPayPaymentProvider implements PaymentProvider {
  private merchantId: string;
  private apiKey: string;
  private apiBase: string;
  
  constructor() {
    this.merchantId = env.QPAY_MERCHANT_ID;
    this.apiKey = env.QPAY_API_KEY;
    this.apiBase = env.QPAY_API_BASE;
  }
  
  async createSession(input: { 
    userId: string; 
    amount: number; 
    currency: string; 
    planId?: string; 
  }) {
    const sessionId = `qpay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // TODO: Implement real QPay API calls
    // 1. Create invoice via QPay API
    // 2. Get QR code or deep link
    // 3. Store external reference
    
    console.log('QPay session creation (TODO):', {
      merchantId: this.merchantId,
      amount: input.amount,
      currency: input.currency,
      sessionId
    });
    
    // Mock response for now
    return {
      sessionId,
      payUrl: `https://qpay.mn/pay/${sessionId}`,
      qrPayload: {
        qr: `QR_PAYMENT_${sessionId}`,
        amount: input.amount,
        currency: input.currency
      }
    };
  }
  
  verifyWebhook(rawBody: string, headers: Record<string, string>) {
    // TODO: Implement QPay webhook signature verification
    // 1. Extract signature from headers
    // 2. Verify HMAC using PAYMENT_WEBHOOK_SECRET
    // 3. Parse webhook payload
    
    console.log('QPay webhook verification (TODO):', {
      headers,
      bodyLength: rawBody.length
    });
    
    // Mock verification for now
    return { ok: true, externalRef: 'qpay_ref_' + Date.now() };
  }
  
  async fetchStatus(sessionId: string): Promise<"pending" | "paid" | "failed"> {
    // TODO: Implement QPay status check
    // 1. Call QPay API to check payment status
    // 2. Return appropriate status
    
    console.log('QPay status check (TODO):', sessionId);
    
    // Mock status for now
    return 'pending';
  }
}
