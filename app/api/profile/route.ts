import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateProfile, type ProfilePatch } from "@/lib/users";

export const runtime = "nodejs";

// keep avatar payloads small (a compressed data: URL). ~200 KB ceiling.
const MAX_AVATAR = 300_000;

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

  const s = (v: unknown) => (typeof v === "string" ? v.trim() : undefined);
  const patch: ProfilePatch = {
    phone: s(body.phone),
    gender: s(body.gender),
    city: s(body.city),
    institution: s(body.institution),
  };

  if (body.age !== undefined && body.age !== null && body.age !== "") {
    const n = Number(body.age);
    if (!Number.isFinite(n) || n < 13 || n > 100) {
      return NextResponse.json({ ok: false, error: "Please enter a valid age (13–100)." }, { status: 400 });
    }
    patch.age = Math.round(n);
  }

  if (typeof body.avatar === "string" && body.avatar) {
    if (!body.avatar.startsWith("data:image/")) {
      return NextResponse.json({ ok: false, error: "Invalid image." }, { status: 400 });
    }
    if (body.avatar.length > MAX_AVATAR) {
      return NextResponse.json(
        { ok: false, error: "That image is too large — please choose a smaller one." },
        { status: 413 }
      );
    }
    patch.avatar = body.avatar;
  }

  try {
    const user = await updateProfile(session.user.id, patch);
    if (!user) return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("profile: update failed", e);
    return NextResponse.json({ ok: false, error: "Couldn't save your profile. Please try again." }, { status: 500 });
  }
}
