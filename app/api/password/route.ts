import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { changePassword } from "@/lib/users";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Please log in first." }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const current = typeof body.current === "string" ? body.current : "";
  const next = typeof body.next === "string" ? body.next : "";
  if (next.length < 8) {
    return NextResponse.json({ ok: false, error: "New password must be at least 8 characters." }, { status: 400 });
  }
  const result = await changePassword(session.user.id, current, next);
  if (result === "wrong") {
    return NextResponse.json({ ok: false, error: "Your current password isn't right." }, { status: 400 });
  }
  if (result === "notfound") {
    return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
