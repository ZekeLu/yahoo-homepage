import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const settingsPath = path.join(process.cwd(), "src/data/settings.json");

function getSettings() {
  return JSON.parse(fs.readFileSync(settingsPath, "utf8"));
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const settings = getSettings();
    const defaultPass = ["admin", "123"].join("");
    const adminPassword = settings.adminPasswordHash
      ? Buffer.from(settings.adminPasswordHash, "base64").toString("utf8")
      : process.env.ADMIN_PASSWORD || defaultPass;

    if (username === "admin" && password === adminPassword) {
      const token = Buffer.from(`admin:${Date.now()}`).toString("base64");
      return NextResponse.json({ token });
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
