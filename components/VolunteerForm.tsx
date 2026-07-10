"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const ROLES = [
  "Host / emcee",
  "Photography & video",
  "Event management",
  "Mentors & judges",
  "Social & design",
  "Registration & hospitality",
  "Wherever needed",
];

export default function VolunteerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [link, setLink] = useState("");
  const [why, setWhy] = useState("");
  const [agree, setAgree] = useState(false);

  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [regId, setRegId] = useState("");
  const [error, setError] = useState("");

  const { data: session } = useSession();
  useEffect(() => {
    const u = session?.user;
    if (!u) return;
    if (u.name) setName((v) => v || u.name || "");
    if (u.email) setEmail((v) => v || u.email || "");
  }, [session]);

  const toggleRole = (r: string) =>
    setRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in your name, email and phone.");
      return;
    }
    if (!agree) {
      setError("Please confirm you can help on the event day.");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "volunteer", name, email, phone, org, roles, link, why }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      setRegId(data.id);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "done") {
    return (
      <div className="reg-done">
        <div className="reg-check">✓</div>
        <h2 className="h2">Thank you for signing up!</h2>
        <p className="lead">
          You&apos;re on the volunteer list, <strong>{name}</strong> (ref{" "}
          <strong>{regId}</strong>). We&apos;ll reach out at <strong>{email}</strong> with the
          next steps and the crew briefing.
        </p>
        <a href="/" className="btn btn-primary">
          Back to Catalyst <span className="arw">→</span>
        </a>
      </div>
    );
  }

  return (
    <form className="reg-form" onSubmit={submit} noValidate>
      <div className="reg-section">
        <h3 className="reg-legend">About you</h3>
        <div className="reg-row">
          <label className="reg-field">
            <span>Full name *</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="reg-field">
            <span>Email *</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
        </div>
        <div className="reg-row">
          <label className="reg-field">
            <span>Phone *</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" required />
          </label>
          <label className="reg-field">
            <span>Institution / where you&apos;re from</span>
            <input value={org} onChange={(e) => setOrg(e.target.value)} />
          </label>
        </div>
        <label className="reg-field">
          <span>Portfolio / LinkedIn (optional)</span>
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="link — great for photo/design roles" />
        </label>
      </div>

      <div className="reg-section">
        <h3 className="reg-legend">How you&apos;d like to help</h3>
        <div className="reg-checks">
          {ROLES.map((r) => (
            <label key={r} className={`reg-check-item${roles.includes(r) ? " on" : ""}`}>
              <input type="checkbox" checked={roles.includes(r)} onChange={() => toggleRole(r)} />
              <span>{r}</span>
            </label>
          ))}
        </div>
        <label className="reg-field">
          <span>Why do you want to volunteer? (optional)</span>
          <textarea value={why} onChange={(e) => setWhy(e.target.value)} rows={3} />
        </label>
      </div>

      <label className="reg-agree">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>I&apos;m available to help on 23 August 2026 in Mysuru.</span>
      </label>

      {error && <p className="reg-error">{error}</p>}

      <button className="btn btn-primary reg-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "Sign up to volunteer"} <span className="arw">→</span>
      </button>
    </form>
  );
}
