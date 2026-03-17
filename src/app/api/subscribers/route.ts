import { NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/dataHelpers';

interface Subscriber {
  email: string;
  date: string;
}

export async function GET() {
  try {
    const subscribers = await readDataFile<Subscriber[]>('subscribers.json').catch(
      () => [] as Subscriber[]
    );
    return NextResponse.json(subscribers);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    const subscribers = await readDataFile<Subscriber[]>('subscribers.json').catch(
      () => [] as Subscriber[]
    );
    subscribers.push({ email, date: new Date().toISOString() });
    await writeDataFile('subscribers.json', subscribers);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { email } = await request.json();
    const subscribers = await readDataFile<Subscriber[]>('subscribers.json').catch(
      () => [] as Subscriber[]
    );
    const filtered = subscribers.filter((s) => s.email !== email);
    await writeDataFile('subscribers.json', filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete' },
      { status: 500 }
    );
  }
}
