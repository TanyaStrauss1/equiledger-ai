// API endpoint to trigger Vercel Workflows
import { NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@/lib/env';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowName, args } = body;

    // Trigger Vercel Workflow
    const response = await fetch(
      `https://api.vercel.com/v1/workflows`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.VERCEL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow: workflowName,
          args,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to trigger workflow');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      workflowId: result.id,
      status: result.status,
    });
  } catch (error) {
    console.error('Workflow trigger error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger workflow' },
      { status: 500 }
    );
  }
}
