import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const BACKEND = process.env.INTERNAL_API_URL ?? "http://turbosouf-api:8080";

const CONFIG_MAP: Record<string, { revalidate: string[] }> = {
  homepage: { revalidate: ["/"] },
  faq: { revalidate: ["/faq", "/"] },
  banners: { revalidate: ["/"] },
  footer: { revalidate: ["/"] },
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!CONFIG_MAP[type]) return NextResponse.json({ error: { message: "Type inconnu" } }, { status: 404 });

  try {
    const res = await fetch(`${BACKEND}/api/v1/site-content/${type}`, { cache: "no-store" });
    if (!res.ok) return NextResponse.json({ data: type === "faq" || type === "banners" ? [] : {} });
    const json = await res.json();
    return NextResponse.json({ data: JSON.parse(json.data.value) });
  } catch {
    return NextResponse.json({ data: type === "faq" || type === "banners" ? [] : {} });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const cfg = CONFIG_MAP[type];
  if (!cfg) return NextResponse.json({ error: { message: "Type inconnu" } }, { status: 404 });

  const authHeader = req.headers.get("authorization") ?? "";

  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND}/api/v1/site-content/${type}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err.error ?? { message: "Erreur backend" } }, { status: res.status });
    }
    cfg.revalidate.forEach(p => revalidatePath(p));
    return NextResponse.json({ data: body });
  } catch {
    return NextResponse.json({ error: { message: "Erreur de sauvegarde" } }, { status: 500 });
  }
}
