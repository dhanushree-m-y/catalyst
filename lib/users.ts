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
  // profile
  gender?: string;
  age?: number;
  dob?: string;
  city?: string;
  state?: string;
  institution?: string;
  bio?: string;
  skills?: string[];
  avatar?: string; // data: URL (small, stored in DB)
  verified?: boolean;
  // internal (email verification), never exposed
  verifyCode?: string;
  verifyExpires?: string;
};
export type PublicUser = Omit<User, "passwordHash">;

export type ProfilePatch = {
  name?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  city?: string;
  state?: string;
  institution?: string;
  bio?: string;
  skills?: string[];
  avatar?: string;
};

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
      // profile columns (added for existing tables too)
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS gender text`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS age integer`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS city text`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS institution text`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar text`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_code text`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_expires timestamptz`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS dob text`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS state text`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio text`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS skills text`;
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
    gender: (r.gender as string) ?? undefined,
    age: r.age == null ? undefined : Number(r.age),
    dob: (r.dob as string) ?? undefined,
    city: (r.city as string) ?? undefined,
    state: (r.state as string) ?? undefined,
    institution: (r.institution as string) ?? undefined,
    bio: (r.bio as string) ?? undefined,
    skills: parseSkills(r.skills),
    avatar: (r.avatar as string) ?? undefined,
    verified: Boolean(r.verified),
  };
}

function parseSkills(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === "string" && v.trim()) {
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }
  return [];
}

const strip = <T extends Record<string, unknown>>(o: T): Partial<T> =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;

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

export async function getUserById(id: string): Promise<User | null> {
  if (hasDb()) {
    const sql = await db();
    const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
    return rows[0] ? rowToUser(rows[0]) : null;
  }
  const list = await readFileUsers();
  return list.find((u) => u.id === id) ?? null;
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
    verified: false,
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
    verified: true, // Google emails are already verified
  };
  if (hasDb()) {
    const sql = await db();
    await sql`INSERT INTO users (id, name, email, role, provider, verified)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${user.role}, 'google', true)
      ON CONFLICT (email) DO NOTHING`;
  } else {
    const list = await readFileUsers();
    list.push(user);
    await writeFileUsers(list);
  }
  return user;
}

/** Update the profile fields for a user. Returns the updated public user. */
export async function updateProfile(id: string, patch: ProfilePatch): Promise<PublicUser | null> {
  const existing = await getUserById(id);
  if (!existing) return null;
  const merged = { ...existing, ...strip(patch as Record<string, unknown>) } as User;
  if (hasDb()) {
    const sql = await db();
    await sql`UPDATE users SET
        name = ${merged.name ?? null},
        phone = ${merged.phone ?? null},
        gender = ${merged.gender ?? null},
        dob = ${merged.dob ?? null},
        city = ${merged.city ?? null},
        state = ${merged.state ?? null},
        institution = ${merged.institution ?? null},
        bio = ${merged.bio ?? null},
        skills = ${JSON.stringify(merged.skills ?? [])},
        avatar = ${merged.avatar ?? null}
      WHERE id = ${id}`;
  } else {
    const list = await readFileUsers();
    const i = list.findIndex((u) => u.id === id);
    if (i >= 0) {
      list[i] = merged;
      await writeFileUsers(list);
    }
  }
  const { passwordHash: _o, ...pub } = merged;
  void _o;
  return pub;
}

/** Generate a fresh 6-digit verification code (15-min expiry). Returns the code. */
export async function setVerifyCode(id: string): Promise<string | null> {
  const user = await getUserById(id);
  if (!user) return null;
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  if (hasDb()) {
    const sql = await db();
    await sql`UPDATE users SET verify_code = ${code}, verify_expires = ${expires} WHERE id = ${id}`;
  } else {
    const list = await readFileUsers();
    const i = list.findIndex((u) => u.id === id);
    if (i >= 0) {
      list[i].verifyCode = code;
      list[i].verifyExpires = expires;
      await writeFileUsers(list);
    }
  }
  return code;
}

/** Check a verification code; on success marks the account verified. */
export async function checkVerifyCode(id: string, code: string): Promise<"ok" | "invalid" | "expired"> {
  const clean = String(code).trim();
  if (hasDb()) {
    const sql = await db();
    const rows = await sql`SELECT verify_code, verify_expires FROM users WHERE id = ${id} LIMIT 1`;
    const r = rows[0];
    if (!r || !r.verify_code) return "invalid";
    if (String(r.verify_code) !== clean) return "invalid";
    const exp = r.verify_expires ? new Date(r.verify_expires as string).getTime() : 0;
    if (exp && exp < Date.now()) return "expired";
    await sql`UPDATE users SET verified = true, verify_code = null, verify_expires = null WHERE id = ${id}`;
    return "ok";
  }
  const list = await readFileUsers();
  const i = list.findIndex((u) => u.id === id);
  if (i < 0 || !list[i].verifyCode) return "invalid";
  if (String(list[i].verifyCode) !== clean) return "invalid";
  const exp = list[i].verifyExpires ? new Date(list[i].verifyExpires as string).getTime() : 0;
  if (exp && exp < Date.now()) return "expired";
  list[i].verified = true;
  delete list[i].verifyCode;
  delete list[i].verifyExpires;
  await writeFileUsers(list);
  return "ok";
}

/** Change a user's password (verifies the current one unless they have none e.g. Google-only). */
export async function changePassword(
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<"ok" | "wrong" | "notfound"> {
  const user = await getUserById(id);
  if (!user) return "notfound";
  if (user.passwordHash) {
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return "wrong";
  }
  const hash = await bcrypt.hash(newPassword, 10);
  if (hasDb()) {
    const sql = await db();
    await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${id}`;
  } else {
    const list = await readFileUsers();
    const i = list.findIndex((u) => u.id === id);
    if (i >= 0) {
      list[i].passwordHash = hash;
      await writeFileUsers(list);
    }
  }
  return "ok";
}

export async function listUsers(): Promise<PublicUser[]> {
  if (hasDb()) {
    const sql = await db();
    const rows = await sql`SELECT id, name, email, phone, role, provider, created_at,
      gender, age, city, institution, verified FROM users ORDER BY created_at DESC`;
    return rows.map(rowToUser);
  }
  const list = await readFileUsers();
  return list
    .map(({ passwordHash: _o, avatar: _a, ...u }) => {
      void _o;
      void _a;
      return u;
    })
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
