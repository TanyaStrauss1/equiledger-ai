// WhatsApp webhook handler with signature verification and multi-tenant support
// Based on production patterns from Storytime Slackbot and Python WhatsApp Bot

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Twilio } from 'twilio';
import { serverEnv } from '@/lib/env';
import { prisma, setBusinessContext } from '@/lib/db';
import { financialTools } from '@/lib/ai/tools';
import { streamText } from 'ai';
import OpenAI from 'openai';

const twilioClient = new Twilio(serverEnv.TWILIO_ACCOUNT_SID, serverEnv.TWILIO_AUTH_TOKEN);

// ===========================================
// SECURITY: WEBHOOK SIGNATURE VERIFICATION
// ===========================================

function verifyTwilioSignature(
  url: string,
  body: string,
  signature: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha1', serverEnv.TWILIO_AUTH_TOKEN)
    .update(url + body)
    .digest('base64');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// ===========================================
// BUSINESS CONTEXT RESOLUTION
// ===========================================

async function resolveBusinessContext(whatsappNumber: string) {
  // Get business user by WhatsApp number
  const user = await prisma.businessUser.findFirst({
    where: { whatsappNumber },
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
        whatsappNumber,
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

  // Use complete AI integration
  const { processAIMessage } = await import('@/lib/ai/processor');
  const responseText = await processAIMessage(businessId, userMessage);

  return { text: responseText };
}

// ===========================================
// WHATSAPP WEBHOOK HANDLER
// ===========================================

export async function POST(request: NextRequest) {
  try {
    // Parse Twilio webhook payload
    const body = await request.text();
    const formData = new URLSearchParams(body);
    
    const from = formData.get('From');
    const messageBody = formData.get('Body');
    const signature = request.headers.get('X-Twilio-Signature') || '';

    // Verify webhook signature
    const url = request.url;
    const isValid = verifyTwilioSignature(url, body, signature);

    if (!isValid) {
      console.error('Invalid Twilio signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!from || !messageBody) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Resolve business context
    const context = await resolveBusinessContext(from);
    
    // Process message with AI
    const result = await processMessage(context.businessId, messageBody);
    const responseText = result.text;

    // Send response via WhatsApp
    const message = await twilioClient.messages.create({
      to: from,
      from: serverEnv.TWILIO_WHATSAPP_NUMBER,
      body: responseText,
    });

    return NextResponse.json({ 
      success: true, 
      messageId: message.sid,
      responseText 
    });

  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Webhook verification for Twilio
export async function GET(request: NextRequest) {
  const challenge = request.nextUrl.searchParams.get('hub.challenge');
  return NextResponse.json({ challenge }, { status: 200 });
}
