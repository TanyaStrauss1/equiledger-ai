// Environment configuration with validation
// This module provides type-safe environment variable access

import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // OpenAI
  OPENAI_API_KEY: z.string(),
  OPENAI_MODEL: z.string().optional().default('gpt-4o-mini'),
  
  // Twilio
  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_WHATSAPP_NUMBER: z.string(),
  TWILIO_SMS_NUMBER: z.string(),
  
  // Telegram
  TELEGRAM_BOT_TOKEN: z.string(),
  TELEGRAM_WEBHOOK_SECRET: z.string().optional(),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  
  // Application
  PORT: z.string().optional().default('3000'),
  APP_BASE_URL: z.string().url(),
  
  // Configuration
  DEFAULT_VAT_RATE: z.string().optional().default('0.15'),
  DEFAULT_CURRENCY: z.string().optional().default('ZAR'),
});

export type Env = z.infer<typeof envSchema>;

// Server-side environment variables (safe to expose)
export const serverEnv = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER,
  TWILIO_SMS_NUMBER: process.env.TWILIO_SMS_NUMBER,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_WEBHOOK_SECRET: process.env.TELEGRAM_WEBHOOK_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  PORT: process.env.PORT,
  APP_BASE_URL: process.env.APP_BASE_URL || 'http://localhost:3000',
  DEFAULT_VAT_RATE: process.env.DEFAULT_VAT_RATE,
  DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY,
});
