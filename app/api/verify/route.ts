import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkVerifyCode } from "@/lib/users";

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
  const code = typeof body.code === "string" ? body.code : "";
  if (!code.trim()) {
    return NextResponse.json({ ok: false, error: "Enter the code from your email." }, { status: 400 });
  }
  const result = await checkVerifyCode(session.user.id, code);
  if (result === "ok") return NextResponse.json({ ok: true });
  if (result === "expired") {
    return NextResponse.json({ ok: false, error: "That code has expired — request a new one." }, { status: 400 });
  }
  return NextResponse.json({ ok: false, error: "That code isn't right." }, { status: 400 });
}
