import { NextResponse } from "next/server";
import { createUser } from "@/lib/users";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = s(body.name);
  const email = s(body.email);
  const phone = s(body.phone);
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || !email || !password) {
    return NextResponse.json(
      { ok: false, error: "Please provide your name, email and a password." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  try {
    await createUser({ name, email, phone, password });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.message === "EMAIL_TAKEN") {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists. Try logging in." },
        { status: 409 }
      );
    }
    console.error("signup: failed", e);
    return NextResponse.json(
      { ok: false, error: "We couldn't create your account just now. Please try again." },
      { status: 500 }
    );
  }
}
