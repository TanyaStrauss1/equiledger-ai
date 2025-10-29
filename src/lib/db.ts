// Core library for database access with multi-tenant isolation
// This module provides secure database access with automatic business ID injection

import { PrismaClient } from '@prisma/client';
import { serverEnv } from '@/lib/env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ===========================================
// MULTI-TENANT CONTEXT MANAGEMENT
// ===========================================

export interface BusinessContext {
  businessId: string;
  userId?: string;
  role?: string;
}

// Thread-local storage for business context
const contextStore = new Map<number, BusinessContext>();

export function setBusinessContext(context: BusinessContext) {
  const threadId = typeof threadId !== 'undefined' ? Number(process.threadId) : 0;
  contextStore.set(threadId, context);
}

export function getBusinessContext(): BusinessContext | null {
  const threadId = typeof threadId !== 'undefined' ? Number(process.threadId) : 0;
  return contextStore.get(threadId) ?? null;
}

// ===========================================
// SECURE DATABASE OPERATIONS
// ===========================================

/**
 * Wraps Prisma queries to ensure business isolation
 * Automatically injects business ID from context
 */
export function withBusinessContext<T>(
  operation: (context: BusinessContext) => Promise<T>
): Promise<T> {
  const context = getBusinessContext();
  if (!context) {
    throw new Error('No business context found. Call setBusinessContext() first.');
  }
  return operation(context);
}

/**
 * Safely execute database operations with business context
 */
export async function safeDbOperation<T>(
  businessId: string,
  operation: () => Promise<T>
): Promise<T> {
  const context: BusinessContext = { businessId };
  setBusinessContext(context);
  
  try {
    return await operation();
  } finally {
    // Context cleanup handled by middleware
  }
}

// ===========================================
// DATABASE UTILITIES
// ===========================================

/**
 * Get user by WhatsApp number with business context
 */
export async function getUserByWhatsApp(whatsappNumber: string, businessId: string) {
  return prisma.businessUser.findFirst({
    where: {
      businessId,
      whatsappNumber,
      isActive: true,
    },
  });
}

/**
 * Get user by Telegram ID with business context
 */
export async function getUserByTelegram(telegramId: string, businessId: string) {
  return prisma.businessUser.findFirst({
    where: {
      businessId,
      telegramId,
      isActive: true,
    },
  });
}

/**
 * Get or create business user
 */
export async function getOrCreateBusinessUser(
  businessId: string,
  data: {
    whatsappNumber?: string;
    telegramId?: string;
    email?: string;
    name?: string;
  }
) {
  // Try to find existing user
  const user = await prisma.businessUser.findFirst({
    where: {
      businessId,
      OR: [
        { whatsappNumber: data.whatsappNumber },
        { telegramId: data.telegramId },
        { email: data.email },
      ],
    },
  });

  if (user) {
    // Update user if needed
    return prisma.businessUser.update({
      where: { id: user.id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  // Create new user
  return prisma.businessUser.create({
    data: {
      businessId,
      ...data,
    },
  });
}

/**
 * Verify business context before operation
 */
export function verifyBusinessContext(businessId: string) {
  const context = getBusinessContext();
  if (!context || context.businessId !== businessId) {
    throw new Error('Business context mismatch. Operation not allowed.');
  }
}
