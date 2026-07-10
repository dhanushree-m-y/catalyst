import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export type Role = "user" | "admin";
export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  provider: "credentials" | "google";
  passwordHash?: string;
  createdAt: string;
};
export type PublicUser = Omit<User, "passwordHash">;

const DB_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  "";
const hasDb = () => DB_URL.length > 0;

type Sql = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Record<string, unknown>[]>;
let ready: Promise<Sql> | null = null;
async function db(): Promise<Sql> {
  if (!ready) {
    ready = (async () => {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(DB_URL) as unknown as Sql;
      await sql`CREATE TABLE IF NOT EXISTS users (
        id text PRIMARY KEY,
        name text,
        email text UNIQUE NOT NULL,
        phone text,
        role text NOT NULL DEFAULT 'user',
        provider text NOT NULL DEFAULT 'credentials',
        password_hash text,
        created_at timestamptz NOT NULL DEFAULT now()
      )`;
      return sql;
    })();
  }
  return ready;
}

const FILE = () => path.join(process.cwd(), "data", "users.json");
async function readFileUsers(): Promise<User[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE(), "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
async function writeFileUsers(list: User[]) {
  await fs.mkdir(path.dirname(FILE()), { recursive: true });
  await fs.writeFile(FILE(), JSON.stringify(list, null, 2), "utf8");
}

// Default admin(s) — used when the ADMIN_EMAILS env var isn't set.
// (Not secret: this email is already published across the site.)
const DEFAULT_ADMINS = ["buildwithcatalyst@gmail.com"];

/** Admin emails come from ADMIN_EMAILS (comma-separated), falling back to DEFAULT_ADMINS. */
export function roleForEmail(email: string): Role {
  const configured = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const admins = configured.length ? configured : DEFAULT_ADMINS;
  return admins.includes(email.trim().toLowerCase()) ? "admin" : "user";
}

function newId() {
  return "USR-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

function rowToUser(r: Record<string, unknown>): User {
  return {
    id: r.id as string,
    name: (r.name as string) ?? "",
    email: r.email as string,
    phone: (r.phone as string) ?? undefined,
    role: (r.role as Role) ?? "user",
    provider: (r.provider as User["provider"]) ?? "credentials",
    passwordHash: (r.password_hash as string) ?? undefined,
    createdAt:
      r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at ?? new Date().toISOString()),
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const e = email.trim().toLowerCase();
  if (hasDb()) {
    const sql = await db();
    const rows = await sql`SELECT * FROM users WHERE lower(email) = ${e} LIMIT 1`;
    return rows[0] ? rowToUser(rows[0]) : null;
  }
  const list = await readFileUsers();
  return list.find((u) => u.email.toLowerCase() === e) ?? null;
}

/** Create an email/password user. Throws "EMAIL_TAKEN" if the email already exists. */
export async function createUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<PublicUser> {
  const email = input.email.trim().toLowerCase();
  if (await getUserByEmail(email)) throw new Error("EMAIL_TAKEN");
  const passwordHash = await bcrypt.hash(input.password, 10);
  const role = roleForEmail(email);
  const user: User = {
    id: newId(),
    name: input.name.trim(),
    email,
    phone: input.phone?.trim() || undefined,
    role,
    provider: "credentials",
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  if (hasDb()) {
    const sql = await db();
    await sql`INSERT INTO users (id, name, email, phone, role, provider, password_hash)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${user.phone ?? null}, ${user.role}, 'credentials', ${passwordHash})`;
  } else {
    const list = await readFileUsers();
    list.push(user);
    await writeFileUsers(list);
  }
  const { passwordHash: _omit, ...pub } = user;
  void _omit;
  return pub;
}

/** Verify email/password. Returns the public user on success, else null. */
export async function verifyCredentials(email: string, password: string): Promise<PublicUser | null> {
  const user = await getUserByEmail(email);
  if (!user || !user.passwordHash) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  const { passwordHash: _omit, ...pub } = user;
  void _omit;
  return pub;
}

/** Create-or-fetch a Google user (no password). */
export async function upsertGoogleUser(input: { name?: string; email: string }): Promise<PublicUser> {
  const existing = await getUserByEmail(input.email);
  if (existing) {
    const { passwordHash: _o, ...pub } = existing;
    void _o;
    return pub;
  }
  const email = input.email.trim().toLowerCase();
  const user: User = {
    id: newId(),
    name: input.name?.trim() || email.split("@")[0],
    email,
    role: roleForEmail(email),
    provider: "google",
    createdAt: new Date().toISOString(),
  };
  if (hasDb()) {
    const sql = await db();
    await sql`INSERT INTO users (id, name, email, role, provider)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${user.role}, 'google')
      ON CONFLICT (email) DO NOTHING`;
  } else {
    const list = await readFileUsers();
    list.push(user);
    await writeFileUsers(list);
  }
  return user;
}

export async function listUsers(): Promise<PublicUser[]> {
  if (hasDb()) {
    const sql = await db();
    const rows = await sql`SELECT id, name, email, phone, role, provider, created_at FROM users ORDER BY created_at DESC`;
    return rows.map(rowToUser);
  }
  const list = await readFileUsers();
  return list
    .map(({ passwordHash: _o, ...u }) => {
      void _o;
      return u;
    })
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
