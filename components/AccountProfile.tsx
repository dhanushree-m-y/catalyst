"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type AccountUser = {
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

export default function AccountProfile({ user, emailEnabled }: { user: AccountUser; emailEnabled: boolean }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

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

  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState("");

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

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("saving");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, gender, dob, city, state: stateV, institution, bio, skills, avatar }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Couldn't save.");
      setStatus("done");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Couldn't save. Please try again.");
    }
  };

  const initials = (name || user.email).slice(0, 1).toUpperCase();

  return (
    <form className="reg-form" onSubmit={save} noValidate>
      {/* identity */}
      <div className="reg-section">
        <div className="profile-head">
          <button type="button" className="avatar-edit" onClick={() => fileRef.current?.click()} aria-label="Upload profile picture">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" />
            ) : (
              <span className="avatar-initial">{initials}</span>
            )}
            <span className="avatar-cam">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          <div className="profile-id">
            <div className="profile-name">
              {name || "Your name"}{" "}
              {user.verified ? (
                <span className="verify-badge ok">✓ Verified</span>
              ) : (
                <span className="verify-badge">Not verified</span>
              )}
            </div>
            <div className="profile-email">{user.email}</div>
            <button type="button" className="avatar-link" onClick={() => fileRef.current?.click()}>
              {avatar ? "Change photo" : "Upload a photo"}
            </button>
          </div>
        </div>
      </div>

      {/* details */}
      <div className="reg-section">
        <h3 className="reg-legend">Your details</h3>
        <div className="reg-row">
          <label className="reg-field">
            <span>Full name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="reg-field">
            <span>Date of birth</span>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </label>
        </div>
        <div className="reg-row">
          <label className="reg-field">
            <span>Phone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" />
          </label>
          <label className="reg-field">
            <span>Gender</span>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Choose…</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="reg-row">
          <label className="reg-field">
            <span>City / place</span>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mysuru" />
          </label>
          <label className="reg-field">
            <span>State</span>
            <input value={stateV} onChange={(e) => setStateV(e.target.value)} placeholder="e.g. Karnataka" />
          </label>
        </div>
        <label className="reg-field">
          <span>Institution / company</span>
          <input value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. NIE Mysuru" />
        </label>
      </div>

      {/* about */}
      <div className="reg-section">
        <h3 className="reg-legend">About you</h3>
        <label className="reg-field">
          <span>Short bio</span>
          <textarea value={bio} maxLength={400} rows={3} onChange={(e) => setBio(e.target.value)} placeholder="Tell us a little about you…" />
        </label>
        <label className="reg-field">
          <span>Skills &amp; interests</span>
          <div className="pf-skills">
            {skills.map((s) => (
              <span key={s} className="pf-skill">
                {s}
                <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} aria-label={`Remove ${s}`}>
                  ×
                </button>
              </span>
            ))}
            <input
              className="pf-skill-input"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="+ Add a skill"
            />
          </div>
        </label>
      </div>

      {error && <p className="reg-error">{error}</p>}

      <button className="btn btn-primary reg-submit" type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : status === "done" ? "Saved ✓" : "Save profile"}
        {status === "idle" && <span className="arw">→</span>}
      </button>

      <SecuritySection verified={!!user.verified} emailEnabled={emailEnabled} />
    </form>
  );
}

function SecuritySection({ verified, emailEnabled }: { verified: boolean; emailEnabled: boolean }) {
  const router = useRouter();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [vState, setVState] = useState<"idle" | "sent">("idle");
  const [vMsg, setVMsg] = useState("");

  const changePw = async () => {
    setErr("");
    setMsg("");
    if (next.length < 8) {
      setErr("New password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: cur, next }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Couldn't change password.");
      setMsg("Password updated.");
      setCur("");
      setNext("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't change password.");
    } finally {
      setBusy(false);
    }
  };

  const sendCode = async () => {
    setVMsg("");
    const res = await fetch("/api/verify/send", { method: "POST" });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setVMsg(data.error || "Couldn't send the code.");
      return;
    }
    setVState("sent");
    setVMsg(data.sent ? "We emailed you a code." : data.devCode ? `Test code: ${data.devCode}` : "Enter your code.");
    if (data.devCode) setCode(data.devCode);
  };
  const verify = async () => {
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setVMsg(data.error || "That code isn't right.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="reg-section">
      <h3 className="reg-legend">Password &amp; security</h3>

      {!verified && emailEnabled && (
        <div className="pf-verify">
          {vState === "idle" ? (
            <button type="button" className="btn btn-dark" onClick={sendCode}>
              Verify email <span className="arw">→</span>
            </button>
          ) : (
            <div className="reg-row">
              <label className="reg-field">
                <span>Verification code</span>
                <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" maxLength={6} />
              </label>
              <div className="reg-field" style={{ justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-primary" onClick={verify}>
                  Verify
                </button>
              </div>
            </div>
          )}
          {vMsg && <p className="reg-note">{vMsg}</p>}
        </div>
      )}

      <div className="reg-row">
        <label className="reg-field">
          <span>Current password</span>
          <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" />
        </label>
        <label className="reg-field">
          <span>New password</span>
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" />
        </label>
      </div>
      {err && <p className="reg-error">{err}</p>}
      {msg && <p className="reg-note" style={{ color: "#1f7a44" }}>{msg}</p>}
      <button type="button" className="btn btn-dark" onClick={changePw} disabled={busy} style={{ marginTop: 8 }}>
        {busy ? "Updating…" : "Update password"}
      </button>
    </div>
  );
}
