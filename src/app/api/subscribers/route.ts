import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const subscribersPath = path.join(process.cwd(), "src/data/subscribers.json");

interface Subscriber {
  email: string;
  date: string;
}

function getSubscribers(): Subscriber[] {
  return JSON.parse(fs.readFileSync(subscribersPath, "utf8"));
}

function saveSubscribers(subscribers: Subscriber[]) {
  fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
}

export async function GET() {
  try {
    const subscribers = getSubscribers();
    return NextResponse.json(subscribers);
  } catch {
    return NextResponse.json({ error: "Failed to read subscribers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const subscribers = getSubscribers();
    const exists = subscribers.some((s) => s.email === email);
    if (exists) {
      return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }
    const newSub: Subscriber = {
      email,
      date: new Date().toISOString(),
    };
    subscribers.push(newSub);
    saveSubscribers(subscribers);
    return NextResponse.json(newSub, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add subscriber" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const subscribers = getSubscribers();
    const filtered = subscribers.filter((s) => s.email !== email);
    saveSubscribers(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}
