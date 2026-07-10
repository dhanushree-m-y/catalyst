"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const FIELDS = [
  "Software / IT",
  "Electronics / ECE",
  "Civil",
  "Mechanical",
  "Design / UX",
  "Other",
];

const INTERESTS = [
  "Events & meetups",
  "Mentorship",
  "Hackathons",
  "Networking",
  "Jobs & internships",
  "Workshops",
];

export default function JoinForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [field, setField] = useState("");
  const [place, setPlace] = useState("");
  const [stage, setStage] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [about, setAbout] = useState("");
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

  const toggle = (r: string) =>
    setInterests((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Please add your name and email.");
      return;
    }
    if (!agree) {
      setError("Please agree to receive Catalyst updates.");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "member",
          name,
          email,
          phone,
          field,
          place,
          stage,
          interests,
          about,
        }),
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
        <h2 className="h2">Welcome to Catalyst!</h2>
        <p className="lead">
          You&apos;re in, <strong>{name}</strong> (ref <strong>{regId}</strong>). We&apos;ll reach
          out at <strong>{email}</strong> with your welcome note and first invites — events,
          mentorship and everything happening in the community.
        </p>
        <div className="reg-done-cta">
          <a href="/git-with-her" className="btn btn-primary">
            Check out Git With Her <span className="arw">→</span>
          </a>
          <a href="/" className="btn btn-ghost">
            Back to Catalyst
          </a>
        </div>
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
            <span>Phone / WhatsApp (optional)</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" />
          </label>
          <label className="reg-field">
            <span>College / city (optional)</span>
            <input value={place} onChange={(e) => setPlace(e.target.value)} />
          </label>
        </div>
        <div className="reg-row">
          <label className="reg-field">
            <span>Your field</span>
            <select value={field} onChange={(e) => setField(e.target.value)}>
              <option value="">Choose your field…</option>
              {FIELDS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
          <label className="reg-field">
            <span>Where you&apos;re at</span>
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
              <option value="">Choose one…</option>
              <option value="Student">Student</option>
              <option value="Working professional">Working professional</option>
              <option value="Career switcher / returner">Career switcher / returner</option>
              <option value="Just exploring">Just exploring</option>
            </select>
          </label>
        </div>
      </div>

      <div className="reg-section">
        <h3 className="reg-legend">What are you here for?</h3>
        <div className="reg-checks">
          {INTERESTS.map((r) => (
            <label key={r} className={`reg-check-item${interests.includes(r) ? " on" : ""}`}>
              <input type="checkbox" checked={interests.includes(r)} onChange={() => toggle(r)} />
              <span>{r}</span>
            </label>
          ))}
        </div>
        <label className="reg-field">
          <span>Anything you&apos;d like us to know? (optional)</span>
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={3} />
        </label>
      </div>

      <label className="reg-agree">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>Keep me posted on Catalyst events, mentorship and opportunities.</span>
      </label>

      {error && <p className="reg-error">{error}</p>}

      <button className="btn btn-primary reg-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Joining…" : "Join Catalyst"} <span className="arw">→</span>
      </button>
    </form>
  );
}
