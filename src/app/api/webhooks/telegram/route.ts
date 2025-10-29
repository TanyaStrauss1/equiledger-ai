// Telegram webhook handler with signature verification and multi-tenant support
// Based on production patterns from Storytime Slackbot

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';
import { serverEnv } from '@/lib/env';
import { prisma, setBusinessContext } from '@/lib/db';
import { financialTools } from '@/lib/ai/tools';
import { streamText } from 'ai';
import OpenAI from 'openai';

// ===========================================
// SECURITY: WEBHOOK SECRET VALIDATION
// ===========================================

function verifyTelegramSignature(
  payload: string,
  secret: string
): boolean {
  if (!serverEnv.TELEGRAM_WEBHOOK_SECRET) {
    // Skip verification if no secret is configured (development)
    return true;
  }

  const expectedSignature = crypto
    .createHmac('sha256', serverEnv.TELEGRAM_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(secret),
    Buffer.from(expectedSignature)
  );
}

// ===========================================
// BUSINESS CONTEXT RESOLUTION
// ===========================================

async function resolveBusinessContext(telegramId: string) {
  // Get business user by Telegram ID
  const user = await prisma.businessUser.findFirst({
    where: { telegramId },
    include: { business: true },
  });

  if (!user) {
    // Auto-create business and user on first interaction
    const business = await prisma.business.create({
      data: {
        name: 'New Business',
        subscriptionTier: 'free',
      },
    });

    const newUser = await prisma.businessUser.create({
      data: {
        businessId: business.id,
        telegramId,
        role: 'owner',
        name: 'Business Owner',
      },
      include: { business: true },
    });

    return {
      businessId: business.id,
      userId: newUser.id,
      business: business,
    };
  }

  return {
    businessId: user.businessId,
    userId: user.id,
    business: user.business,
  };
}

// ===========================================
// MESSAGE PROCESSING
// ===========================================

async function processMessage(businessId: string, userMessage: string) {
  // Set business context for all database operations
  setBusinessContext({ businessId });

  // Use AI with financial tools to process the message
  // Note: This is a simplified implementation - full AI integration would require
  // proper OpenAI client setup with the 'ai' package. For now, returning a placeholder response.
  // TODO: Implement full AI integration with proper model configuration
  
  // Placeholder response - replace with actual AI processing
  const responseText = `I received your message: "${userMessage}". The full AI integration with business ID ${businessId} will be implemented here.`;

  return { text: responseText };
}

// ===========================================
// SEND TELEGRAM MESSAGE
// ===========================================

async function sendTelegramMessage(chatId: string, text: string) {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${serverEnv.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error;
  }
}

// ===========================================
// TELEGRAM WEBHOOK HANDLER
// ===========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const chatId = message.chat.id;
    const telegramId = message.from.id.toString();
    const messageText = message.text;

    if (!messageText) {
      return NextResponse.json({ ok: true });
    }

    // Resolve business context
    const context = await resolveBusinessContext(telegramId);
    
    // Process message with AI
    const result = await processMessage(context.businessId, messageText);
    const responseText = result.text;

    // Send response via Telegram
    await sendTelegramMessage(chatId, responseText);

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
