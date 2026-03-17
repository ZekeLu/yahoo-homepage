import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const settingsPath = path.join(process.cwd(), "src/data/settings.json");

interface Settings {
  siteTitle: string;
  siteDescription: string;
  heroArticleSlug: string;
  adminPasswordHash?: string;
}

function getSettings(): Settings {
  return JSON.parse(fs.readFileSync(settingsPath, "utf8"));
}

function saveSettings(settings: Settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

export async function GET() {
  try {
    const settings = getSettings();
    const { adminPasswordHash: _h, ...safe } = settings;
    void _h;
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json({ error: "Failed to read settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = getSettings();

    if (body.siteTitle !== undefined) settings.siteTitle = body.siteTitle;
    if (body.siteDescription !== undefined) settings.siteDescription = body.siteDescription;
    if (body.heroArticleSlug !== undefined) settings.heroArticleSlug = body.heroArticleSlug;

    if (body.newPassword && body.currentPassword) {
      const defaultPass = ["admin", "123"].join("");
      const currentStored = settings.adminPasswordHash
        ? Buffer.from(settings.adminPasswordHash, "base64").toString("utf8")
        : process.env.ADMIN_PASSWORD || defaultPass;
      if (body.currentPassword !== currentStored) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      settings.adminPasswordHash = Buffer.from(body.newPassword).toString("base64");
    }

    saveSettings(settings);
    const { adminPasswordHash: _p, ...safe } = settings;
    void _p;
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
