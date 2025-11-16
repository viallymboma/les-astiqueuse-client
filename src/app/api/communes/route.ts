import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("nicenice", `${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/communes`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/communes`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // or 'force-cache' for caching
    });

    if (!response.ok) {
      throw new Error('Failed to fetch communes');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching communes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch communes' },
      { status: 500 }
    );
  }
}

