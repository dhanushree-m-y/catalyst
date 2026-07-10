import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserById } from "@/lib/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ user: null });
  try {
    const u = await getUserById(session.user.id);
    if (!u) return NextResponse.json({ user: null });
    return NextResponse.json({ user: { name: u.name, avatar: u.avatar ?? null, role: u.role } });
  } catch {
    return NextResponse.json({ user: { name: session.user.name ?? "", avatar: null, role: session.user.role } });
  }
}
