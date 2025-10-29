// API route for invoices
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const businessId = request.nextUrl.searchParams.get('businessId');
    const status = request.nextUrl.searchParams.get('status');
    
    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 });
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        businessId,
        ...(status && { status: status as any }),
      },
      include: {
        client: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const formattedInvoices = invoices.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      clientName: inv.client.name,
      amount: inv.items.reduce((sum, item) => sum + Number(item.unitPrice), 0),
      status: inv.status,
      createdAt: inv.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      invoices: formattedInvoices,
    });
  } catch (error) {
    console.error('Invoices API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
