// app/api/prospects/register/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log(body, "mmmmmmmmmmmmmmmm")

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/prospects/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: body, 
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    console.log(data, "mmmmmmmdatammmmmmmmm")

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to register prospect' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error registering prospect:', error);
    return NextResponse.json(
      { error: 'Failed to register prospect' },
      { status: 500 }
    );
  }
}