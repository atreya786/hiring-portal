import { NextResponse } from 'next/server';
import { verifyDatabaseConnection } from '@/lib/server/mongodb';

export async function GET() {
  try {
    const result = await verifyDatabaseConnection();
    if (result.connected) {
      return NextResponse.json({
        status: 'ok',
        connected: true,
        database: result.databaseName,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          status: 'error',
          connected: false,
          message: 'Could not connect to MongoDB Atlas database.',
        },
        { status: 503 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'error',
        connected: false,
        message: 'Unexpected database connection error.',
      },
      { status: 500 }
    );
  }
}
