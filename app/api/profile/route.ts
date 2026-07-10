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
    name: s(body.name),
    phone: s(body.phone),
    gender: s(body.gender),
    dob: s(body.dob),
    city: s(body.city),
    state: s(body.state),
    institution: s(body.institution),
    bio: s(body.bio)?.slice(0, 400),
  };

  if (Array.isArray(body.skills)) {
    patch.skills = (body.skills as unknown[])
      .filter((x) => typeof x === "string")
      .map((x) => (x as string).trim())
      .filter(Boolean)
      .slice(0, 20);
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
