// API route for dashboard statistics
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get business ID from query or context (in production, from auth)
    const businessId = request.nextUrl.searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 });
    }

    // Calculate dashboard stats
    const invoices = await prisma.invoice.findMany({
      where: { businessId },
      include: { items: true, payments: true },
    });

    const expenses = await prisma.expense.findMany({
      where: { businessId },
    });

    // Calculate totals
    const totalRevenue = invoices
      .filter(inv => inv.status === 'PAID')
      .reduce((sum, inv) => 
        sum + inv.items.reduce((itemSum, item) => itemSum + Number(item.unitPrice), 0), 
        0
      );

    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const unpaidInvoices = invoices.filter(inv => inv.status !== 'PAID').length;
    const activeClients = await prisma.client.count({ where: { businessId } });
    
    const vatCollected = invoices.reduce((sum, inv) => sum + Number(inv.vatAmount), 0);
    const vatClaimable = expenses.reduce((sum, exp) => sum + Number(exp.vatAmount), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalExpenses,
        unpaidInvoices,
        activeClients,
        vatCollected,
        vatClaimable,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
