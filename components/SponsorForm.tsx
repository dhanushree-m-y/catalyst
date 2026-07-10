"use client";

import { useEffect, useState } from "react";

const LEVELS: { key: string; label: string }[] = [
  { key: "title", label: "Title sponsor" },
  { key: "gold", label: "Gold sponsor" },
  { key: "silver", label: "Silver sponsor" },
  { key: "inkind", label: "In-kind — food, venue, prizes or swag" },
  { key: "unsure", label: "Not sure yet — let's talk" },
];

export default function SponsorForm() {
  const [organization, setOrganization] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [level, setLevel] = useState("unsure");
  const [message, setMessage] = useState("");

  // pre-select the tier from ?tier= in the URL (set by the tier cards on the homepage)
  useEffect(() => {
    const tier = new URLSearchParams(window.location.search).get("tier");
    if (tier && LEVELS.some((l) => l.key === tier)) setLevel(tier);
  }, []);

  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [regId, setRegId] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!organization.trim() || !contact.trim() || !email.trim()) {
      setError("Please fill in your organization, contact person and email.");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "sponsor",
          organization,
          contact,
          email,
          phone,
          website,
          tier: LEVELS.find((l) => l.key === level)?.label ?? level,
          message,
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
        <h2 className="h2">Thank you — let&apos;s talk!</h2>
        <p className="lead">
          We&apos;ve received <strong>{organization}</strong>&apos;s interest (ref{" "}
          <strong>{regId}</strong>). Our team will reach out to <strong>{email}</strong> with a
          sponsorship deck and the next steps.
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
        <h3 className="reg-legend">Your organization</h3>
        <div className="reg-row">
          <label className="reg-field">
            <span>Organization / company *</span>
            <input value={organization} onChange={(e) => setOrganization(e.target.value)} required />
          </label>
          <label className="reg-field">
            <span>Contact person *</span>
            <input value={contact} onChange={(e) => setContact(e.target.value)} required />
          </label>
        </div>
        <div className="reg-row">
          <label className="reg-field">
            <span>Email *</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="reg-field">
            <span>Phone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" />
          </label>
        </div>
        <label className="reg-field">
          <span>Website</span>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" />
        </label>
      </div>

      <div className="reg-section">
        <h3 className="reg-legend">How you&apos;d like to support</h3>
        <label className="reg-field">
          <span>Sponsorship level</span>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            {LEVELS.map((l) => (
              <option key={l.key} value={l.key}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <label className="reg-field">
          <span>Message (optional)</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Tell us how you'd like to get involved." />
        </label>
      </div>

      {error && <p className="reg-error">{error}</p>}

      <button className="btn btn-primary reg-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "Become a sponsor"} <span className="arw">→</span>
      </button>
    </form>
  );
}
