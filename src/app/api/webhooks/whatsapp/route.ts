// WhatsApp webhook handler with signature verification and multi-tenant support
// Based on production patterns from Storytime Slackbot and Python WhatsApp Bot

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Twilio } from 'twilio';
import { serverEnv } from '@/lib/env';
import { prisma, setBusinessContext } from '@/lib/db';
import { financialTools } from '@/lib/ai/tools';
import { streamText } from 'ai';
import { openai } from 'ai/openai';

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

  // Use AI with financial tools to process the message
  const result = await streamText({
    model: openai(serverEnv.OPENAI_MODEL),
    messages: [
      {
        role: 'system',
        content: `You are EquiLedger AI, a financial assistant for South African SMEs. You help with invoicing, expenses, VAT calculations, and financial management. Always include the business ID "${businessId}" in your tool calls for multi-tenant isolation.`,
      },
      { role: 'user', content: userMessage },
    ],
    tools: {
      createInvoice: financialTools[0],
      listInvoices: financialTools[1],
      markInvoicePaid: financialTools[2],
      logExpense: financialTools[3],
      getFinancialSummary: financialTools[4],
      createClient: financialTools[5],
    },
    maxSteps: 5,
  });

  return result;
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

    // Get response text
    let responseText = '';
    for await (const chunk of result.textStream) {
      responseText += chunk;
    }

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
