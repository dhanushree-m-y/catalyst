import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listSubmissions, type Submission, type Kind } from "@/lib/store";
import { listUsers, type PublicUser } from "@/lib/users";
import LogoutButton from "@/components/LogoutButton";
import Flower from "@/components/Flower";
import CursorGlow from "@/components/CursorGlow";
import AdminDeleteButton from "@/components/AdminDeleteButton";
import type { ReactNode } from "react";

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

const STAT_ICONS: Record<string, ReactNode> = {
  team: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  member: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
  sponsor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M5 12v9h14v-9" />
      <path d="M12 8S9.5 3 7.2 4.6 12 8 12 8zM12 8s2.5-5 4.8-3.4S12 8 12 8z" />
    </svg>
  ),
  volunteer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 5.6a5 5 0 0 0-7.4-.2L12 6.8l-1.4-1.4a5 5 0 1 0-7 7.1L12 21l8.4-9.3a5 5 0 0 0 .4-6.1z" />
    </svg>
  ),
  host: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  accounts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" />
      <path d="M6.2 16c.3-1.6 1.5-2.5 2.8-2.5s2.5.9 2.8 2.5" /><path d="M14.5 9.5H18M14.5 13H18" />
    </svg>
  ),
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

  const stats: { label: string; value: number; href: string; icon: string }[] = [
    { label: "Team registrations", value: byKind.participant.length, href: "#participant", icon: "team" },
    { label: "Community members", value: byKind.member.length, href: "#member", icon: "member" },
    { label: "Sponsors", value: byKind.sponsor.length, href: "#sponsor", icon: "sponsor" },
    { label: "Volunteers", value: byKind.volunteer.length, href: "#volunteer", icon: "volunteer" },
    { label: "Event proposals", value: byKind.host.length, href: "#host", icon: "host" },
    { label: "Accounts", value: userCount, href: "#accounts", icon: "accounts" },
  ];

  return (
    <div className="admin-page">
      <Flower className="admin-flower af1" />
      <Flower className="admin-flower af2" />
      <header className="admin-top">
        <div className="admin-head-left">
          <div className="eyebrow admin-eyebrow">Your dashboard</div>
          <h1 className="admin-title">Catalyst control room</h1>
          <p className="admin-sub">Everyone who&apos;s registered, joined or reached out — all in one place.</p>
        </div>
        <div className="admin-top-actions">
          <a href="/api/admin?format=csv" className="btn btn-dark">↓ Download all (CSV)</a>
          <LogoutButton className="btn btn-ghost" />
        </div>
      </header>

      {dbError && (
        <p className="admin-note">Couldn&apos;t reach the database. If this is production, make sure the database is connected and redeployed.</p>
      )}

      <div className="admin-stats">
        {stats.map((s) => (
          <a key={s.label} href={s.href} className="admin-stat">
            <span className="admin-stat-ico">{STAT_ICONS[s.icon]}</span>
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
                      <th aria-label="Actions"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((r) => (
                      <tr key={r.id}>
                        {meta.cols.map(([key, label]) => (
                          <td key={label}>{cell(r[key])}</td>
                        ))}
                        <td className="admin-when">{fmtDate(r.submittedAt)}</td>
                        <td className="admin-act">
                          <AdminDeleteButton
                            id={r.id}
                            label={cell(r[meta.cols[0][0]]) || meta.label}
                          />
                        </td>
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
                  <th aria-label="Actions"></th>
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
                    <td className="admin-act">
                      {u.role === "admin" ? (
                        <span className="admin-act-lock" title="Admin accounts can't be deleted here">—</span>
                      ) : (
                        <AdminDeleteButton id={u.id} type="user" label={u.email} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <CursorGlow />
    </div>
  );
}
