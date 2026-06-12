import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";

const CONFIG_PATH = join(process.cwd(), "src/data/site-config.json");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readFile(CONFIG_PATH, "utf-8");
    return NextResponse.json({ data: JSON.parse(data) });
  } catch {
    return NextResponse.json({ data: {} });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await writeFile(CONFIG_PATH, JSON.stringify(body, null, 2), "utf-8");
    revalidatePath("/contact");
    return NextResponse.json({ data: body });
  } catch {
    return NextResponse.json({ error: { message: "Erreur de sauvegarde" } }, { status: 500 });
  }
}
