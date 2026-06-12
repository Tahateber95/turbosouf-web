import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const CONFIG_MAP: Record<string, { file: string; revalidate: string[] }> = {
  homepage: { file: "homepage-config.json", revalidate: ["/"] },
  faq: { file: "faq-config.json", revalidate: ["/faq"] },
  banners: { file: "banners-config.json", revalidate: ["/"] },
};

function getPath(type: string) {
  const entry = CONFIG_MAP[type];
  if (!entry) return null;
  return { filePath: join(process.cwd(), "src/data", entry.file), paths: entry.revalidate };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const config = getPath(type);
  if (!config) return NextResponse.json({ error: { message: "Type inconnu" } }, { status: 404 });

  try {
    const data = await readFile(config.filePath, "utf-8");
    return NextResponse.json({ data: JSON.parse(data) });
  } catch {
    return NextResponse.json({ data: type === "faq" || type === "banners" ? [] : {} });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const config = getPath(type);
  if (!config) return NextResponse.json({ error: { message: "Type inconnu" } }, { status: 404 });

  try {
    const body = await req.json();
    await writeFile(config.filePath, JSON.stringify(body, null, 2), "utf-8");
    config.paths.forEach(p => revalidatePath(p));
    return NextResponse.json({ data: body });
  } catch {
    return NextResponse.json({ error: { message: "Erreur de sauvegarde" } }, { status: 500 });
  }
}
