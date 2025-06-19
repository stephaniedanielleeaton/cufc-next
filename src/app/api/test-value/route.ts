import { NextResponse } from 'next/server';

import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    // Example: fetch a single document from a 'test' collection
    const doc = await db.collection('test').findOne({});
    return NextResponse.json({ mongoDoc: doc });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
