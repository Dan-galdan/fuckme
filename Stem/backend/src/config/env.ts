import { config } from 'dotenv';

config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000'),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  API_URL: process.env.API_URL || 'http://localhost:4000',
  
  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/physics_school',
  
  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || '15m',
  REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL || '30d',
  EMAIL_VERIFICATION_REQUIRED: process.env.EMAIL_VERIFICATION_REQUIRED === 'true',
  
  // SMTP
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.ethereal.email',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Physics School <no-reply@school.local>',
  
  // Payments
  PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER || 'mock',
  QPAY_MERCHANT_ID: process.env.QPAY_MERCHANT_ID || '',
  QPAY_API_KEY: process.env.QPAY_API_KEY || '',
  QPAY_API_BASE: process.env.QPAY_API_BASE || 'https://api.qpay.mn',
  PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET || 'dev-webhook-secret',
  
  // Feature Flags
  ENABLE_SUBSCRIPTIONS: process.env.ENABLE_SUBSCRIPTIONS === 'true',
  RETEST_INTERVAL_DAYS: parseInt(process.env.RETEST_INTERVAL_DAYS || '14'),
  RETEST_AFTER_N_LESSONS: parseInt(process.env.RETEST_AFTER_N_LESSONS || '8'),
  RECOMMENDATION_COUNT: parseInt(process.env.RECOMMENDATION_COUNT || '6')
} as const;
