"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Flower from "./Flower";

export type DashUser = {
  name: string;
  email: string;
  role: "user" | "admin";
  verified?: boolean;
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

const GENDERS = ["Woman", "Non-binary", "Prefer to self-describe", "Prefer not to say"];
type Tab = "personal" | "education" | "interests" | "security";

// tiny inline icons
const I = {
  profile: "M12 12a4 4 0 100-8 4 4 0 000 8zm-8 8a8 8 0 0116 0",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  cal: "M4 5h16v16H4zM4 9h16M9 3v4M15 3v4",
  doc: "M6 3h9l5 5v13H6zM14 3v6h6",
  team: "M9 11a3 3 0 100-6 3 3 0 000 6zm7 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3 20a6 6 0 0112 0M15 20a5 5 0 018-3.9",
  cert: "M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7zM9 12l2 2 4-4",
  msg: "M4 5h16v11H8l-4 4z",
  book: "M6 3h12v18l-6-4-6 4z",
  gear: "M12 9a3 3 0 100 6 3 3 0 000-6zM19 12a7 7 0 00-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 00-1.7-1L14.5 2h-4l-.3 2.4a7 7 0 00-1.7 1l-2.4-1-2 3.4L4 11a7 7 0 000 2l-2 1.6 2 3.4 2.4-1a7 7 0 001.7 1l.3 2.4h4l.3-2.4a7 7 0 001.7-1l2.4 1 2-3.4L19 13a7 7 0 000-1z",
};
const Ic = ({ d }: { d: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export default function AccountDashboard({ user }: { user: DashUser }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<Tab>("personal");
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // editable fields
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [gender, setGender] = useState(user.gender || "");
  const [dob, setDob] = useState(user.dob || "");
  const [city, setCity] = useState(user.city || "");
  const [stateV, setStateV] = useState(user.state || "");
  const [institution, setInstitution] = useState(user.institution || "");
  const [bio, setBio] = useState(user.bio || "");
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [avatar, setAvatar] = useState(user.avatar || "");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const pct = useMemo(() => {
    const vals = [avatar, phone, dob, gender, city, stateV, institution, bio, skills.length ? "x" : ""];
    const filled = vals.filter((v) => v && String(v).trim()).length;
    return Math.round((filled / vals.length) * 100);
  }, [avatar, phone, dob, gender, city, stateV, institution, bio, skills]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const size = 256;
        const c = document.createElement("canvas");
        c.width = size;
        c.height = size;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        setAvatar(c.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s) && skills.length < 20) setSkills([...skills, s]);
    setSkillInput("");
  };

  const save = async () => {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, gender, dob, city, state: stateV, institution, bio, skills, avatar }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Couldn't save.");
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (name || user.email).slice(0, 1).toUpperCase();
  const roleLabel = user.role === "admin" ? "Admin" : "Member";
  const location = [city, stateV].filter(Boolean).join(", ");

  const NAV: { key: string; label: string; icon: string; href?: string; onClick?: () => void; badge?: number }[] = [
    { key: "profile", label: "My Profile", icon: I.profile, onClick: () => setTab("personal") },
    { key: "dash", label: "Dashboard", icon: I.grid, href: user.role === "admin" ? "/admin" : undefined },
    { key: "events", label: "My Events", icon: I.cal, href: "/git-with-her" },
    { key: "apps", label: "My Applications", icon: I.doc },
    { key: "team", label: "My Team", icon: I.team, href: "/register" },
    { key: "cert", label: "Certificates", icon: I.cert },
    { key: "msg", label: "Messages", icon: I.msg, badge: 2, href: "mailto:buildwithcatalyst@gmail.com" },
    { key: "book", label: "Bookmarks", icon: I.book },
    { key: "set", label: "Settings", icon: I.gear, onClick: () => setTab("security") },
  ];

  return (
    <div className={`dash${navOpen ? " nav-open" : ""}`}>
      {/* SIDEBAR */}
      <aside className="dash-side">
        <a href="/" className="dash-brand">
          <span className="dash-spark">✦</span>
          <span>
            <span className="dash-word">Catalyst</span>
            <span className="dash-tag">A space for women to grow</span>
          </span>
        </a>

        <nav className="dash-nav">
          {NAV.map((n) =>
            n.href ? (
              <a key={n.key} href={n.href} className="dash-navitem">
                <Ic d={n.icon} /> <span>{n.label}</span>
                {n.badge && <em>{n.badge}</em>}
              </a>
            ) : (
              <button
                key={n.key}
                className={`dash-navitem${n.key === "profile" && tab !== "security" ? " active" : ""}${n.key === "set" && tab === "security" ? " active" : ""}`}
                onClick={n.onClick}
                type="button"
              >
                <Ic d={n.icon} /> <span>{n.label}</span>
                {n.badge && <em>{n.badge}</em>}
              </button>
            )
          )}
        </nav>

        <div className="dash-promo">
          <div className="dash-promo-name">Git With Her &rsquo;26</div>
          <p>8 hours. Real impact. Endless possibilities.</p>
          <a href="/register" className="dash-promo-btn">Register Now →</a>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Women-cutout.png" alt="" />
        </div>
        <div className="dash-copy">© 2026 Catalyst. All rights reserved.</div>
      </aside>

      {navOpen && <div className="dash-scrim" onClick={() => setNavOpen(false)} />}

      {/* MAIN */}
      <div className="dash-main">
        <header className="dash-top">
          <button className="dash-burger" onClick={() => setNavOpen((o) => !o)} aria-label="Menu">
            <Ic d="M4 6h16M4 12h16M4 18h16" />
          </button>
          <div className="dash-top-right">
            <button className="dash-bell" aria-label="Notifications">
              <Ic d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
              <em>2</em>
            </button>
            <div className="dash-userchip">
              <button onClick={() => setMenuOpen((o) => !o)} type="button">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="" />
                ) : (
                  <span className="dash-userinit">{initials}</span>
                )}
                {name.split(" ")[0] || "Account"} ▾
              </button>
              {menuOpen && (
                <div className="dash-menu">
                  {user.role === "admin" && <a href="/admin">Admin dashboard</a>}
                  <button type="button" onClick={() => signOut({ callbackUrl: "/" })}>Log out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="dash-body">
          <Flower className="dash-flower df1" />
          <Flower className="dash-flower df2" />
          <h1 className="dash-h1">My Profile</h1>
          <div className="dash-tabs">
            {(["personal", "education", "interests", "security"] as Tab[]).map((t) => (
              <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)} type="button">
                {t === "personal" ? "Personal Info" : t === "education" ? "Education" : t === "interests" ? "Interests" : "Password & Security"}
              </button>
            ))}
          </div>

          {tab === "personal" && (
            <>
              {/* Overview */}
              <div className="dash-card dash-overview">
                <div className="dash-ov-head">Profile Overview</div>
                <div className="dash-ov-body">
                  <button type="button" className="dash-avatar" onClick={() => fileRef.current?.click()} aria-label="Upload photo">
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatar} alt="" />
                    ) : (
                      <span>{initials}</span>
                    )}
                    <span className="dash-avatar-cam">
                      <Ic d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z" />
                    </span>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
                  <div className="dash-ov-id">
                    <div className="dash-ov-name">
                      {name || "Your name"} <span className="dash-role">{roleLabel}</span>
                    </div>
                    <div className="dash-ov-line">✉ {user.email} {user.verified && <em className="dash-verified">verified</em>}</div>
                    {phone && <div className="dash-ov-line">☎ {phone}</div>}
                    {location && <div className="dash-ov-line">◍ {location}</div>}
                  </div>
                  <div className="dash-journey">
                    <div className="dash-journey-title">✦ Your journey starts here!</div>
                    <p>Complete your profile to unlock personalised opportunities.</p>
                    <div className="dash-bar"><span style={{ width: `${pct}%` }} /></div>
                    <div className="dash-pct">{pct}%</div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="dash-card">
                <div className="dash-card-head">
                  <h3>Personal Information</h3>
                  <button className="dash-save" onClick={save} disabled={saving} type="button">
                    {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
                  </button>
                </div>
                <div className="dash-grid">
                  <Field label="Full Name"><input value={name} onChange={(e) => setName(e.target.value)} /></Field>
                  <Field label="Date of Birth"><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></Field>
                  <Field label="Phone Number"><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" /></Field>
                  <Field label="Gender">
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="">Choose…</option>
                      {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field label="City / Place"><input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mysuru" /></Field>
                  <Field label="State"><input value={stateV} onChange={(e) => setStateV(e.target.value)} placeholder="e.g. Karnataka" /></Field>
                  <Field label="Institution / Company" full><input value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. NIE Mysuru" /></Field>
                </div>
              </div>

              {/* About You */}
              <div className="dash-card">
                <div className="dash-card-head">
                  <h3>About You</h3>
                  <button className="dash-save" onClick={save} disabled={saving} type="button">
                    {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
                  </button>
                </div>
                <div className="dash-about">
                  <div>
                    <label className="dash-flabel">Short Bio</label>
                    <textarea value={bio} maxLength={400} rows={4} onChange={(e) => setBio(e.target.value)} placeholder="Tell us a little about you…" />
                    <div className="dash-count">{bio.length}/400</div>
                  </div>
                  <div>
                    <label className="dash-flabel">Skills</label>
                    <div className="dash-skills">
                      {skills.map((s) => (
                        <span key={s} className="dash-skill">
                          {s}
                          <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}>×</button>
                        </span>
                      ))}
                      <span className="dash-skill add">
                        <input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                          placeholder="+ Add a skill"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {error && <p className="reg-error" style={{ marginTop: 8 }}>{error}</p>}
            </>
          )}

          {tab === "education" && (
            <div className="dash-card">
              <div className="dash-card-head"><h3>Education</h3>
                <button className="dash-save" onClick={save} disabled={saving} type="button">{saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}</button>
              </div>
              <div className="dash-grid">
                <Field label="Institution / Company" full><input value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. NIE Mysuru" /></Field>
                <Field label="City / Place"><input value={city} onChange={(e) => setCity(e.target.value)} /></Field>
                <Field label="State"><input value={stateV} onChange={(e) => setStateV(e.target.value)} /></Field>
              </div>
            </div>
          )}

          {tab === "interests" && (
            <div className="dash-card">
              <div className="dash-card-head"><h3>Interests &amp; Skills</h3>
                <button className="dash-save" onClick={save} disabled={saving} type="button">{saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}</button>
              </div>
              <label className="dash-flabel">Your skills &amp; interests</label>
              <div className="dash-skills">
                {skills.map((s) => (
                  <span key={s} className="dash-skill">{s}<button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}>×</button></span>
                ))}
                <span className="dash-skill add">
                  <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="+ Add" />
                </span>
              </div>
            </div>
          )}

          {tab === "security" && <SecurityTab verified={!!user.verified} emailEnabled />}
        </div>
      </div>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`dash-field${full ? " full" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function SecurityTab({ verified }: { verified: boolean; emailEnabled?: boolean }) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const change = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setMsg("");
    if (next.length < 8) { setErr("New password must be at least 8 characters."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ current: cur, next }) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Couldn't change password.");
      setMsg("Password updated."); setCur(""); setNext("");
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Couldn't change password."); }
    finally { setBusy(false); }
  };

  return (
    <div className="dash-card">
      <div className="dash-card-head"><h3>Password &amp; Security</h3></div>
      <p className="dash-sec-row">
        Email verification: {verified ? <span className="verify-badge ok">✓ Verified</span> : <span className="verify-badge">Not verified</span>}
      </p>
      <form className="dash-grid" onSubmit={change}>
        <Field label="Current password"><input type="password" value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" /></Field>
        <Field label="New password"><input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" /></Field>
        <div className="dash-field full">
          {err && <p className="reg-error">{err}</p>}
          {msg && <p className="dash-ok">{msg}</p>}
          <button className="dash-save" type="submit" disabled={busy}>{busy ? "Updating…" : "Update password"}</button>
        </div>
      </form>
    </div>
  );
}
