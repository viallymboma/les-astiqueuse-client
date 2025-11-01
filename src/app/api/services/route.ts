import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // or 'force-cache' for caching
    });

    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}