// AI Tools for Financial Operations
// These tools are used by the AI agent to interact with the financial system
// All operations automatically include business context for multi-tenant isolation

// Note: Full AI tool implementation will be added when AI integration is complete
// For now, this file provides the structure but tools are not active

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getBusinessContext, verifyBusinessContext } from '@/lib/db';

// ===========================================
// INVOICE TOOLS
// ===========================================

// TODO: Properly implement with 'ai' package tool() function
export const createInvoiceTool = {
  description: 'Create a new invoice for a client',
  parameters: z.object({
    businessId: z.string().describe('The business ID for tenant isolation'),
    clientName: z.string().describe('The name of the client'),
    amount: z.number().describe('The invoice amount'),
    description: z.string().describe('Invoice description'),
    currency: z.string().optional().default('ZAR'),
    vatIncluded: z.boolean().optional().default(true),
  }),
  execute: async ({ businessId, clientName, amount, description, currency, vatIncluded }: {
    businessId: string;
    clientName: string;
    amount: number;
    description: string;
    currency?: string;
    vatIncluded?: boolean;
  }) => {
    // Verify business context
    verifyBusinessContext(businessId);

    // Get or create client
    let client = await prisma.client.findFirst({
      where: { businessId, name: clientName },
    });

    if (!client) {
      client = await prisma.client.create({
        data: { businessId, name: clientName },
      });
    }

    // Calculate VAT
    const vatRate = 0.15; // South African VAT rate
    const vatAmount = vatIncluded 
      ? amount * (vatRate / (1 + vatRate))
      : amount * vatRate;

    // Get next invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });
    
    const invoiceNumber = lastInvoice 
      ? `INV-${parseInt(lastInvoice.invoiceNumber.split('-')[1]) + 1}`
      : 'INV-1';

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        businessId,
        clientId: client.id,
        invoiceNumber,
        currency,
        vatIncluded,
        vatRate,
        vatAmount,
        status: 'DRAFT',
        items: {
          create: {
            description,
            quantity: 1,
            unitPrice: amount,
          },
        },
      },
      include: { client: true, items: true },
    });

    return {
      success: true,
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        clientName: client.name,
        amount,
        vatAmount,
        totalAmount: vatIncluded ? amount : amount + vatAmount,
        status: invoice.status,
      },
    };
  },
};

export const listInvoicesTool = {
  description: 'List all invoices for a business',
  parameters: z.object({
    businessId: z.string(),
    status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE']).optional(),
    limit: z.number().optional().default(10),
  }),
  execute: async ({ businessId, status, limit }: {
    businessId: string;
    status?: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
    limit?: number;
  }) => {
    verifyBusinessContext(businessId);

    const invoices = await prisma.invoice.findMany({
      where: {
        businessId,
        ...(status && { status }),
      },
      include: { client: true, items: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return {
      success: true,
      invoices: invoices.map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        clientName: inv.client.name,
        status: inv.status,
        createdAt: inv.createdAt,
      })),
    };
  },
};

export const markInvoicePaidTool = {
  description: 'Mark an invoice as paid',
  parameters: z.object({
    businessId: z.string(),
    invoiceId: z.string(),
    paymentMethod: z.string().optional().default('manual'),
    reference: z.string().optional(),
  }),
  execute: async ({ businessId, invoiceId, paymentMethod, reference }: {
    businessId: string;
    invoiceId: string;
    paymentMethod?: string;
    reference?: string;
  }) => {
    verifyBusinessContext(businessId);

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId, businessId },
      data: { status: 'PAID' },
      include: { client: true, items: true },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        invoiceId,
        amount: invoice.items.reduce((sum, item) => sum + Number(item.unitPrice), 0),
        method: paymentMethod,
        reference,
      },
    });

    return {
      success: true,
      message: `Invoice ${invoice.invoiceNumber} marked as paid`,
    };
  },
};

// ===========================================
// EXPENSE TOOLS
// ===========================================

export const logExpenseTool = {
  description: 'Log a business expense',
  parameters: z.object({
    businessId: z.string(),
    amount: z.number(),
    description: z.string(),
    category: z.string().optional().default('other'),
    date: z.string().optional(),
  }),
  execute: async ({ businessId, amount, description, category, date }: {
    businessId: string;
    amount: number;
    description: string;
    category?: string;
    date?: string;
  }) => {
    verifyBusinessContext(businessId);

    // Calculate VAT (expenses have claimable VAT)
    const vatAmount = amount * 0.15;

    const expense = await prisma.expense.create({
      data: {
        businessId,
        amount,
        description,
        category,
        vatAmount,
        date: date ? new Date(date) : new Date(),
      },
    });

    return {
      success: true,
      expense: {
        id: expense.id,
        description,
        amount,
        vatAmount,
        category,
      },
    };
  },
};

export const getFinancialSummaryTool = {
  description: 'Get a financial summary for a date range',
  parameters: z.object({
    businessId: z.string(),
    startDate: z.string(),
    endDate: z.string(),
  }),
  execute: async ({ businessId, startDate, endDate }: {
    businessId: string;
    startDate: string;
    endDate: string;
  }) => {
    verifyBusinessContext(businessId);

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get invoices
    const invoices = await prisma.invoice.findMany({
      where: {
        businessId,
        createdAt: { gte: start, lte: end },
      },
      include: { items: true },
    });

    // Get expenses
    const expenses = await prisma.expense.findMany({
      where: {
        businessId,
        date: { gte: start, lte: end },
      },
    });

    // Calculate totals
    const revenue = invoices.reduce((sum, inv) => 
      sum + inv.items.reduce((itemSum, item) => itemSum + Number(item.unitPrice), 0), 
      0
    );
    
    const expenseTotal = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const vatCollected = invoices.reduce((sum, inv) => sum + Number(inv.vatAmount), 0);
    const vatClaimable = expenses.reduce((sum, exp) => sum + Number(exp.vatAmount), 0);

    return {
      success: true,
      summary: {
        revenue,
        expenses: expenseTotal,
        profit: revenue - expenseTotal,
        vatCollected,
        vatClaimable,
        netVAT: vatCollected - vatClaimable,
      },
    };
  },
};

// ===========================================
// CLIENT TOOLS
// ===========================================

export const createClientTool = {
  description: 'Create a new client',
  parameters: z.object({
    businessId: z.string(),
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    vatNumber: z.string().optional(),
  }),
  execute: async ({ businessId, name, email, phone, vatNumber }: {
    businessId: string;
    name: string;
    email?: string;
    phone?: string;
    vatNumber?: string;
  }) => {
    verifyBusinessContext(businessId);

    const client = await prisma.client.create({
      data: {
        businessId,
        name,
        email,
        phone,
        vatNumber,
      },
    });

    return {
      success: true,
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
      },
    };
  },
};

// ===========================================
// TOOL EXPORT
// ===========================================

export const financialTools = [
  createInvoiceTool,
  listInvoicesTool,
  markInvoicePaidTool,
  logExpenseTool,
  getFinancialSummaryTool,
  createClientTool,
];
