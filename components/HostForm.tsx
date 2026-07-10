"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const FORMATS = [
  "Workshop",
  "Panel / talk",
  "Study jam",
  "Meetup",
  "Hackathon / build day",
  "Something else",
];

export default function HostForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [format, setFormat] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [timing, setTiming] = useState("");
  const [link, setLink] = useState("");
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !eventTitle.trim() || !description.trim()) {
      setError("Please fill in your name, email, the event idea and a short description.");
      return;
    }
    if (!agree) {
      setError("Please confirm we can reach out to you about your idea.");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "host",
          name,
          email,
          phone,
          org,
          eventTitle,
          format,
          description,
          audience,
          timing,
          link,
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
        <h2 className="h2">Thanks — we&apos;d love to hear more!</h2>
        <p className="lead">
          Your idea <strong>&ldquo;{eventTitle}&rdquo;</strong> is with us, <strong>{name}</strong>{" "}
          (ref <strong>{regId}</strong>). We&apos;ll get back to you at <strong>{email}</strong> to
          find the space, the people and the support to make it happen.
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
            <span>Phone (optional)</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" />
          </label>
          <label className="reg-field">
            <span>Institution / community (optional)</span>
            <input value={org} onChange={(e) => setOrg(e.target.value)} />
          </label>
        </div>
      </div>

      <div className="reg-section">
        <h3 className="reg-legend">Your event idea</h3>
        <label className="reg-field">
          <span>Event title / idea *</span>
          <input
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="e.g. Intro to PCB design workshop"
            required
          />
        </label>
        <div className="reg-row">
          <label className="reg-field">
            <span>Format</span>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="">Choose a format…</option>
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
          <label className="reg-field">
            <span>Expected audience size</span>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. 20–30"
            />
          </label>
        </div>
        <label className="reg-field">
          <span>What&apos;s it about &amp; who is it for? *</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="A couple of lines on the idea, the goal and who should come."
            required
          />
        </label>
        <div className="reg-row">
          <label className="reg-field">
            <span>Preferred timing (optional)</span>
            <input
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              placeholder="A month, a weekend, or 'flexible'"
            />
          </label>
          <label className="reg-field">
            <span>Link — deck, portfolio or profile (optional)</span>
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" />
          </label>
        </div>
      </div>

      <label className="reg-agree">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>You can reach out to me about this idea and next steps.</span>
      </label>

      {error && <p className="reg-error">{error}</p>}

      <button className="btn btn-primary reg-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Propose this event"} <span className="arw">→</span>
      </button>
    </form>
  );
}
