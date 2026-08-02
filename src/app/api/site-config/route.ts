import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const BACKEND = process.env.INTERNAL_API_URL ?? "http://turbosouf-api:8080";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/v1/site-content/site-config`, { cache: "no-store" });
    if (!res.ok) return NextResponse.json({ data: {} });
    const json = await res.json();
    return NextResponse.json({ data: JSON.parse(json.data.value) });
  } catch {
    return NextResponse.json({ data: {} });
  }
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get("authorization") ?? "";
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND}/api/v1/site-content/site-config`, {
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
    revalidatePath("/contact");
    return NextResponse.json({ data: body });
  } catch {
    return NextResponse.json({ error: { message: "Erreur de sauvegarde" } }, { status: 500 });
  }
}
