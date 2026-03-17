import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const trendingPath = path.join(process.cwd(), "src/data/trending.json");

function getTrending(): string[] {
  return JSON.parse(fs.readFileSync(trendingPath, "utf8"));
}

function saveTrending(topics: string[]) {
  fs.writeFileSync(trendingPath, JSON.stringify(topics, null, 2));
}

export async function GET() {
  try {
    const trending = getTrending();
    return NextResponse.json(trending);
  } catch {
    return NextResponse.json({ error: "Failed to read trending" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const topics = await request.json();
    if (!Array.isArray(topics)) {
      return NextResponse.json({ error: "Expected array" }, { status: 400 });
    }
    saveTrending(topics);
    return NextResponse.json(topics);
  } catch {
    return NextResponse.json({ error: "Failed to update trending" }, { status: 500 });
  }
}
