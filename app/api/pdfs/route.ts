import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  try {
    const resourcesDir = path.join(process.cwd(), "public", "resources");
    const entries = await fs.readdir(resourcesDir, { withFileTypes: true });

    const pdfs = entries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".pdf"))
      .map((e) => ({
        name: e.name,
        url: `/resources/${e.name}`,
        displayName: e.name.replace(/_/g, " "),
      }));

    return NextResponse.json({ pdfs });
  } catch (err) {
    console.error("Error reading PDFs:", err);
    return NextResponse.json({ pdfs: [] }, { status: 200 });
  }
}
