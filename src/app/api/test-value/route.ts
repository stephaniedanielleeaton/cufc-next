import { NextResponse } from 'next/server';

export async function GET() {
  const value = process.env.TEST_BACKEND_VALUE || '';
  return NextResponse.json({ value });
}
