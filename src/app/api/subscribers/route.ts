import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { readDataFile, writeDataFile } from '@/lib/dataHelpers';
import { SubscriberSchema } from '@/lib/validation';
import { withRateLimit } from '@/lib/apiRateLimit';

interface Subscriber {
  email: string;
  date: string;
}

export async function GET(request: Request) {
  const rateLimited = await withRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const subscribers = await readDataFile<Subscriber[]>('subscribers.json').catch(
      () => [] as Subscriber[]
    );
    return NextResponse.json(subscribers);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const rateLimited = await withRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const parsed = SubscriberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Email required', details: parsed.error.issues },
        { status: 400 }
      );
    }
    const subscribers = await readDataFile<Subscriber[]>('subscribers.json').catch(
      () => [] as Subscriber[]
    );
    subscribers.push({ email: parsed.data.email, date: new Date().toISOString() });
    await writeDataFile('subscribers.json', subscribers);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const rateLimited = await withRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const parsed = SubscriberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }
    const subscribers = await readDataFile<Subscriber[]>('subscribers.json').catch(
      () => [] as Subscriber[]
    );
    const filtered = subscribers.filter((s) => s.email !== parsed.data.email);
    await writeDataFile('subscribers.json', filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Failed to delete' },
      { status: 500 }
    );
  }
}
