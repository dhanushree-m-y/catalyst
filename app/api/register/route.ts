import { NextResponse } from "next/server";
import { saveSubmission, type Kind, type Submission } from "@/lib/store";

export const runtime = "nodejs";

const PREFIX: Record<Kind, string> = {
  participant: "GWH",
  volunteer: "VOL",
  sponsor: "SPN",
  host: "HST",
  member: "MEM",
};

function validate(kind: Kind, b: Record<string, unknown>): string[] {
  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const missing: string[] = [];
  if (kind === "participant") {
    if (!s(b.teamName)) missing.push("team name");
    if (!s(b.institution)) missing.push("institution");
    const lead = (b.lead ?? {}) as Record<string, unknown>;
    if (!s(lead.name)) missing.push("team lead name");
    if (!s(lead.email)) missing.push("team lead email");
    // no payment at registration — shortlisted teams pay later
  } else if (kind === "volunteer") {
    if (!s(b.name)) missing.push("name");
    if (!s(b.email)) missing.push("email");
    if (!s(b.phone)) missing.push("phone");
  } else if (kind === "sponsor") {
    if (!s(b.organization)) missing.push("organization");
    if (!s(b.contact)) missing.push("contact person");
    if (!s(b.email)) missing.push("email");
  } else if (kind === "host") {
    if (!s(b.name)) missing.push("name");
    if (!s(b.email)) missing.push("email");
    if (!s(b.eventTitle)) missing.push("event title / idea");
    if (!s(b.description)) missing.push("a short description");
  } else if (kind === "member") {
    if (!s(b.name)) missing.push("name");
    if (!s(b.email)) missing.push("email");
  }
  return missing;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const kind: Kind =
    body.kind === "volunteer" ||
    body.kind === "sponsor" ||
    body.kind === "host" ||
    body.kind === "member"
      ? (body.kind as Kind)
      : "participant";

  const missing = validate(kind, body);
  if (missing.length) {
    return NextResponse.json(
      { ok: false, error: `Please provide: ${missing.join(", ")}.` },
      { status: 400 }
    );
  }

  const id = `${PREFIX[kind]}-` + Date.now().toString(36).toUpperCase().slice(-6);
  const record = { ...body, id, kind, submittedAt: new Date().toISOString() } as Submission;

  try {
    await saveSubmission(kind, record);
  } catch (e) {
    console.error("register: could not persist", e);
    return NextResponse.json(
      { ok: false, error: "We couldn't save that just now. Please try again in a moment." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id });
}
