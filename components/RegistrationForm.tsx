"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const PROBLEMS = [
  "AI for social impact",
  "Women's safety & wellbeing",
  "Access for all",
  "Undecided — we'll bring our own idea",
];

const UPI_ID = "catalyst@upi"; // TODO: replace with the real Catalyst UPI id
const FEE = 400;
const UPI_LINK = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=Catalyst&am=${FEE}.00&cu=INR&tn=${encodeURIComponent(
  "Git With Her registration"
)}`;

type Member = { name: string; email: string; github: string };
const emptyMember = (): Member => ({ name: "", email: "", github: "" });

export default function RegistrationForm() {
  const [teamName, setTeamName] = useState("");
  const [institution, setInstitution] = useState("");
  const [problem, setProblem] = useState(PROBLEMS[0]);
  const [size, setSize] = useState(3);
  const [lead, setLead] = useState({ name: "", email: "", phone: "", github: "", linkedin: "" });
  const [members, setMembers] = useState<Member[]>([emptyMember(), emptyMember()]);
  const [txn, setTxn] = useState("");
  const [agree, setAgree] = useState(false);

  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [regId, setRegId] = useState("");
  const [error, setError] = useState("");

  const changeSize = (n: number) => {
    setSize(n);
    setMembers((prev) => {
      const need = n - 1; // members excluding the lead
      const next = prev.slice(0, need);
      while (next.length < need) next.push(emptyMember());
      return next;
    });
  };

  const setMember = (i: number, key: keyof Member, val: string) =>
    setMembers((prev) => prev.map((m, idx) => (idx === i ? { ...m, [key]: val } : m)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!teamName.trim() || !institution.trim() || !lead.name.trim() || !lead.email.trim()) {
      setError("Please fill in your team name, institution, and team-lead name & email.");
      return;
    }
    if (!txn.trim()) {
      setError("Please complete the ₹400 payment and enter the UPI reference number.");
      return;
    }
    if (!agree) {
      setError("Please accept the code of conduct to register.");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName,
          institution,
          problem,
          size,
          lead,
          members,
          payment: { amount: FEE, txn },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Registration failed.");
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
        <h2 className="h2">You&apos;re registered!</h2>
        <p className="lead">
          Team <strong>{teamName}</strong> is in for Git With Her. Your registration id is{" "}
          <strong>{regId}</strong> — we&apos;ve noted your payment reference and will confirm by
          email at <strong>{lead.email}</strong>.
        </p>
        <a href="/git-with-her" className="btn btn-primary">
          Back to the hackathon <span className="arw">→</span>
        </a>
      </div>
    );
  }

  return (
    <form className="reg-form" onSubmit={submit} noValidate>
      {/* Team */}
      <div className="reg-section">
        <h3 className="reg-legend">Your team</h3>
        <div className="reg-row">
          <label className="reg-field">
            <span>Team name *</span>
            <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g. Byte Builders" required />
          </label>
          <label className="reg-field">
            <span>Institution / college *</span>
            <input value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. NIE Mysuru" required />
          </label>
        </div>
        <div className="reg-row">
          <label className="reg-field">
            <span>Problem statement</span>
            <select value={problem} onChange={(e) => setProblem(e.target.value)}>
              {PROBLEMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="reg-field">
            <span>Team size</span>
            <select value={size} onChange={(e) => changeSize(Number(e.target.value))}>
              <option value={2}>2 members</option>
              <option value={3}>3 members</option>
              <option value={4}>4 members</option>
            </select>
          </label>
        </div>
      </div>

      {/* Lead */}
      <div className="reg-section">
        <h3 className="reg-legend">Team lead</h3>
        <div className="reg-row">
          <label className="reg-field">
            <span>Full name *</span>
            <input value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} required />
          </label>
          <label className="reg-field">
            <span>Email *</span>
            <input type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} required />
          </label>
        </div>
        <div className="reg-row">
          <label className="reg-field">
            <span>Phone</span>
            <input value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} placeholder="+91…" />
          </label>
          <label className="reg-field">
            <span>GitHub</span>
            <input value={lead.github} onChange={(e) => setLead({ ...lead, github: e.target.value })} placeholder="github.com/username" />
          </label>
        </div>
        <label className="reg-field">
          <span>LinkedIn</span>
          <input value={lead.linkedin} onChange={(e) => setLead({ ...lead, linkedin: e.target.value })} placeholder="linkedin.com/in/username" />
        </label>
      </div>

      {/* Members */}
      <div className="reg-section">
        <h3 className="reg-legend">Team members ({members.length})</h3>
        {members.map((m, i) => (
          <div className="reg-member" key={i}>
            <div className="reg-member-no">{i + 2}</div>
            <div className="reg-row">
              <label className="reg-field">
                <span>Name</span>
                <input value={m.name} onChange={(e) => setMember(i, "name", e.target.value)} />
              </label>
              <label className="reg-field">
                <span>Email</span>
                <input type="email" value={m.email} onChange={(e) => setMember(i, "email", e.target.value)} />
              </label>
              <label className="reg-field">
                <span>GitHub</span>
                <input value={m.github} onChange={(e) => setMember(i, "github", e.target.value)} placeholder="username" />
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Payment */}
      <div className="reg-section reg-pay">
        <h3 className="reg-legend">Payment — ₹{FEE} per team</h3>
        <div className="reg-pay-grid">
          <div className="reg-qr">
            <QRCodeSVG value={UPI_LINK} size={152} bgColor="#ffffff" fgColor="#4a1330" level="M" />
          </div>
          <div className="reg-pay-info">
            <p className="reg-pay-help">
              Scan the QR with any UPI app to pay <strong>₹{FEE}</strong>, or send it to{" "}
              <strong>{UPI_ID}</strong>. Then enter the reference below so we can match your
              payment to your team.
            </p>
            <label className="reg-field">
              <span>UPI transaction / UTR reference *</span>
              <input value={txn} onChange={(e) => setTxn(e.target.value)} placeholder="12-digit reference" required />
            </label>
          </div>
        </div>
      </div>

      <label className="reg-agree">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>
          We agree to the Catalyst code of conduct and confirm all members are women.
        </span>
      </label>

      {error && <p className="reg-error">{error}</p>}

      <button className="btn btn-primary reg-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "Complete registration"} <span className="arw">→</span>
      </button>
    </form>
  );
}
