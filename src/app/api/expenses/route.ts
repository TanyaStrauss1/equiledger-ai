// API route for expenses
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const businessId = request.nextUrl.searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 });
    }

    const expenses = await prisma.expense.findMany({
      where: { businessId },
      orderBy: { date: 'desc' },
      take: 100,
    });

    const formattedExpenses = expenses.map(exp => ({
      id: exp.id,
      description: exp.description,
      amount: Number(exp.amount),
      category: exp.category,
      date: exp.date.toISOString(),
      vatAmount: Number(exp.vatAmount),
    }));

    return NextResponse.json({
      success: true,
      expenses: formattedExpenses,
    });
  } catch (error) {
    console.error('Expenses API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, amount, description, category, date } = body;

    if (!businessId || !amount || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const vatAmount = amount * 0.15; // South African VAT rate

    const expense = await prisma.expense.create({
      data: {
        businessId,
        amount,
        description,
        category: category || 'other',
        vatAmount,
        date: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      expense: {
        id: expense.id,
        description: expense.description,
        amount: Number(expense.amount),
        category: expense.category,
        vatAmount: Number(expense.vatAmount),
      },
    });
  } catch (error) {
    console.error('Create expense error:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}
