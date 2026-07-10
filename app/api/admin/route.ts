import { NextResponse } from "next/server";
import { listSubmissions, deleteSubmission, KINDS, type Kind, type Submission } from "@/lib/store";
import { deleteUser } from "@/lib/users";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** True if the request is from a logged-in admin, or carries the ADMIN_KEY. */
async function isAdmin(req: Request): Promise<boolean> {
  const key = new URL(req.url).searchParams.get("key");
  const admin = process.env.ADMIN_KEY;
  if (admin && key === admin) return true;
  const session = await auth();
  return session?.user?.role === "admin";
}

/**
 * View / export submissions. Protected by the ADMIN_KEY env var.
 *   /api/admin?key=YOUR_KEY                -> JSON, all signups
 *   /api/admin?key=YOUR_KEY&kind=member    -> JSON, one kind
 *   /api/admin?key=YOUR_KEY&format=csv     -> CSV download (opens in Excel/Sheets)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const admin = process.env.ADMIN_KEY;

  // Authorized either by the ADMIN_KEY query param, or by a logged-in admin session.
  const byKey = !!admin && key === admin;
  let bySession = false;
  if (!byKey) {
    const session = await auth();
    bySession = session?.user?.role === "admin";
  }
  if (!byKey && !bySession) {
    return new NextResponse("Not found", { status: 404 });
  }

  const kindParam = url.searchParams.get("kind");
  const kind = kindParam && (KINDS as string[]).includes(kindParam) ? (kindParam as Kind) : undefined;
  const rows = await listSubmissions(kind);

  if (url.searchParams.get("format") === "csv") {
    const csv = toCsv(rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="catalyst-${kind ?? "all"}.csv"`,
      },
    });
  }

  return NextResponse.json({ count: rows.length, rows });
}

/** Delete one submission row or one account. Body: { type: "submission"|"user", id }. */
export async function DELETE(req: Request) {
  if (!(await isAdmin(req))) return new NextResponse("Not found", { status: 404 });

  let body: { type?: string; id?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body */
  }
  const id = typeof body.id === "string" ? body.id.trim() : "";
  const type = body.type === "user" ? "user" : "submission";
  if (!id) return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });

  const removed = type === "user" ? await deleteUser(id) : await deleteSubmission(id);
  return NextResponse.json({ ok: removed });
}

function toCsv(rows: Submission[]): string {
  if (rows.length === 0) return "";
  // union of all keys, with the common ones first
  const first = ["kind", "id", "submittedAt"];
  const keys = new Set<string>(first);
  rows.forEach((r) => Object.keys(r).forEach((k) => keys.add(k)));
  const cols = Array.from(keys);

  const esc = (v: unknown) => {
    const s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const lines = [cols.join(",")];
  for (const r of rows) lines.push(cols.map((c) => esc((r as Record<string, unknown>)[c])).join(","));
  return lines.join("\n");
}
