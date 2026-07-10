import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listSubmissions, type Submission, type Kind } from "@/lib/store";
import { listUsers, type PublicUser } from "@/lib/users";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = { title: "Admin dashboard — Catalyst" };
export const dynamic = "force-dynamic";

const KIND_META: Record<Kind, { label: string; cols: [string, string][] }> = {
  participant: {
    label: "Team registrations",
    cols: [["teamName", "Team"], ["institution", "Institution"], ["lead", "Lead"], ["problem", "Problem"]],
  },
  member: {
    label: "Community members",
    cols: [["name", "Name"], ["email", "Email"], ["phone", "Phone"], ["field", "Field"]],
  },
  volunteer: {
    label: "Volunteers",
    cols: [["name", "Name"], ["email", "Email"], ["phone", "Phone"], ["roles", "Roles"]],
  },
  sponsor: {
    label: "Sponsors",
    cols: [["organization", "Organisation"], ["contact", "Contact"], ["email", "Email"], ["tier", "Level"]],
  },
  host: {
    label: "Event proposals",
    cols: [["name", "Name"], ["email", "Email"], ["eventTitle", "Idea"], ["format", "Format"]],
  },
};

function cell(v: unknown): string {
  if (v == null) return "—";
  if (Array.isArray(v)) return v.join(", ") || "—";
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    return [o.name, o.email].filter(Boolean).join(" · ") || JSON.stringify(o);
  }
  return String(v);
}

function fmtDate(iso: string): string {
  // avoid locale/timezone surprises — show YYYY-MM-DD HH:MM
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "admin") {
    return (
      <div className="admin-page">
        <div className="admin-denied">
          <h1 className="h2">Not authorised</h1>
          <p className="lead">This area is for Catalyst admins only.</p>
          <a href="/" className="btn btn-primary">Back to Catalyst</a>
        </div>
      </div>
    );
  }

  let rows: Submission[] = [];
  let users: PublicUser[] = [];
  let dbError = false;
  try {
    rows = await listSubmissions();
    users = await listUsers();
  } catch {
    dbError = true;
  }
  const userCount = users.length;

  const kinds = Object.keys(KIND_META) as Kind[];
  const byKind = Object.fromEntries(kinds.map((k) => [k, rows.filter((r) => r.kind === k)])) as Record<
    Kind,
    Submission[]
  >;

  const stats: { label: string; value: number; href: string }[] = [
    { label: "Team registrations", value: byKind.participant.length, href: "#participant" },
    { label: "Community members", value: byKind.member.length, href: "#member" },
    { label: "Sponsors", value: byKind.sponsor.length, href: "#sponsor" },
    { label: "Volunteers", value: byKind.volunteer.length, href: "#volunteer" },
    { label: "Event proposals", value: byKind.host.length, href: "#host" },
    { label: "Accounts", value: userCount, href: "#accounts" },
  ];

  return (
    <div className="admin-page">
      <header className="admin-top">
        <div>
          <div className="eyebrow">Catalyst · Admin</div>
          <h1 className="admin-title">Dashboard</h1>
        </div>
        <div className="admin-top-actions">
          <a href="/api/admin?format=csv" className="btn btn-dark">Download all (CSV)</a>
          <LogoutButton className="btn btn-ghost" />
        </div>
      </header>

      {dbError && (
        <p className="admin-note">Couldn&apos;t reach the database. If this is production, make sure the database is connected and redeployed.</p>
      )}

      <div className="admin-stats">
        {stats.map((s) => (
          <a key={s.label} href={s.href} className="admin-stat">
            <div className="admin-stat-num">{s.value}</div>
            <div className="admin-stat-label">{s.label}</div>
          </a>
        ))}
      </div>

      {kinds.map((k) => {
        const list = byKind[k];
        const meta = KIND_META[k];
        return (
          <section key={k} id={k} className="admin-section">
            <div className="admin-section-head">
              <h2>
                {meta.label} <span className="admin-count">{list.length}</span>
              </h2>
              {list.length > 0 && (
                <a href={`/api/admin?format=csv&kind=${k}`} className="admin-csv">
                  Download CSV
                </a>
              )}
            </div>
            {list.length === 0 ? (
              <p className="admin-empty">No {meta.label.toLowerCase()} yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      {meta.cols.map(([, label]) => (
                        <th key={label}>{label}</th>
                      ))}
                      <th>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((r) => (
                      <tr key={r.id}>
                        {meta.cols.map(([key, label]) => (
                          <td key={label}>{cell(r[key])}</td>
                        ))}
                        <td className="admin-when">{fmtDate(r.submittedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}

      <section id="accounts" className="admin-section">
        <div className="admin-section-head">
          <h2>
            Accounts <span className="admin-count">{users.length}</span>
          </h2>
        </div>
        {users.length === 0 ? (
          <p className="admin-empty">No accounts yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Institution</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name || "—"}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || "—"}</td>
                    <td>{u.city || "—"}</td>
                    <td>{u.institution || "—"}</td>
                    <td>{u.gender || "—"}</td>
                    <td>{u.age ?? "—"}</td>
                    <td>{u.role}</td>
                    <td className="admin-when">{fmtDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
