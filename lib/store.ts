import { promises as fs } from "fs";
import path from "path";

export type Kind = "participant" | "volunteer" | "sponsor" | "host" | "member";

const FILE: Record<Kind, string> = {
  participant: "registrations.json",
  volunteer: "volunteers.json",
  sponsor: "sponsors.json",
  host: "host-proposals.json",
  member: "members.json",
};

export type Submission = { id: string; kind: Kind; submittedAt: string } & Record<string, unknown>;

// Neon (Vercel Postgres) sets one of these connection strings in production.
const DB_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  "";

const hasDb = () => DB_URL.length > 0;

// minimal shape of the Neon tagged-template query function (rows in, rows out)
type Sql = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Record<string, unknown>[]>;

// lazily create one Neon client + ensure the table exists (once per instance)
let ready: Promise<Sql> | null = null;
async function db(): Promise<Sql> {
  if (!ready) {
    ready = (async () => {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(DB_URL) as unknown as Sql;
      await sql`CREATE TABLE IF NOT EXISTS submissions (
        id text PRIMARY KEY,
        kind text NOT NULL,
        data jsonb NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )`;
      return sql;
    })();
  }
  return ready;
}

/** Persist one submission. Throws on DB failure so the caller can surface an error. */
export async function saveSubmission(kind: Kind, record: Submission): Promise<void> {
  if (hasDb()) {
    const sql = await db();
    await sql`INSERT INTO submissions (id, kind, data)
      VALUES (${record.id}, ${kind}, ${JSON.stringify(record)}::jsonb)`;
    return;
  }
  // local dev: append to data/<file>.json (gitignored)
  const file = path.join(process.cwd(), "data", FILE[kind]);
  await fs.mkdir(path.dirname(file), { recursive: true });
  let list: unknown[] = [];
  try {
    const parsed = JSON.parse(await fs.readFile(file, "utf8"));
    if (Array.isArray(parsed)) list = parsed;
  } catch {
    list = [];
  }
  list.push(record);
  await fs.writeFile(file, JSON.stringify(list, null, 2), "utf8");
}

/** Read submissions (optionally filtered by kind), newest first. */
export async function listSubmissions(kind?: Kind): Promise<Submission[]> {
  if (hasDb()) {
    const sql = await db();
    const rows = kind
      ? await sql`SELECT id, kind, data, created_at FROM submissions WHERE kind = ${kind} ORDER BY created_at DESC`
      : await sql`SELECT id, kind, data, created_at FROM submissions ORDER BY created_at DESC`;
    return rows.map((r) => ({
      ...(r.data as Record<string, unknown>),
      id: r.id as string,
      kind: r.kind as Kind,
      submittedAt: (r.created_at as Date)?.toISOString?.() ?? String(r.created_at),
    })) as Submission[];
  }
  const out: Submission[] = [];
  const kinds = kind ? [kind] : (Object.keys(FILE) as Kind[]);
  for (const k of kinds) {
    try {
      const parsed = JSON.parse(await fs.readFile(path.join(process.cwd(), "data", FILE[k]), "utf8"));
      if (Array.isArray(parsed)) out.push(...parsed.map((x) => ({ kind: k, ...x }) as Submission));
    } catch {
      /* no file yet */
    }
  }
  return out;
}

/** Delete one submission by id. Returns true if a row was removed. */
export async function deleteSubmission(id: string): Promise<boolean> {
  if (hasDb()) {
    const sql = await db();
    const rows = await sql`DELETE FROM submissions WHERE id = ${id} RETURNING id`;
    return rows.length > 0;
  }
  let removed = false;
  for (const k of Object.keys(FILE) as Kind[]) {
    const file = path.join(process.cwd(), "data", FILE[k]);
    try {
      const parsed = JSON.parse(await fs.readFile(file, "utf8"));
      if (Array.isArray(parsed)) {
        const next = parsed.filter((x) => (x as { id?: string }).id !== id);
        if (next.length !== parsed.length) {
          await fs.writeFile(file, JSON.stringify(next, null, 2), "utf8");
          removed = true;
        }
      }
    } catch {
      /* no file yet */
    }
  }
  return removed;
}

export const KINDS = Object.keys(FILE) as Kind[];
