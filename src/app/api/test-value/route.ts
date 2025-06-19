import { NextResponse } from 'next/server';

export async function GET() {
  // Return a backend value from .env
  const value = process.env.TEST_BACKEND_VALUE || '';
  return NextResponse.json({ value });
}
