"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

const PROBLEMS = [
  "Carbon Footprint & Climate Tech",
  "Rural Empowerment",
  "Open Innovation",
  "Undecided — we'll pick on the day",
];

type Member = { name: string; email: string; github: string };
const emptyMember = (): Member => ({ name: "", email: "", github: "" });

const MAX_DECK_MB = 25;
const DECK_EXT = [".pdf", ".ppt", ".pptx", ".odp"];

export default function RegistrationForm() {
  const [teamName, setTeamName] = useState("");
  const [institution, setInstitution] = useState("");
  const [problem, setProblem] = useState(PROBLEMS[0]);
  const [size, setSize] = useState(3);
  const [lead, setLead] = useState({ name: "", email: "", phone: "", github: "", linkedin: "" });
  const [members, setMembers] = useState<Member[]>([emptyMember(), emptyMember()]);
  const [agree, setAgree] = useState(false);

  // shortlisting phase: project title, written approach, repo, and a pitch deck
  const [projectTitle, setProjectTitle] = useState("");
  const [approach, setApproach] = useState("");
  const [repo, setRepo] = useState("");
  const [deckLink, setDeckLink] = useState("");
  const [deck, setDeck] = useState<{ url: string; name: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [regId, setRegId] = useState("");
  const [error, setError] = useState("");

  // prefill the team lead from the logged-in account
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user) {
      setLead((prev) => ({
        ...prev,
        name: prev.name || session.user?.name || "",
        email: prev.email || session.user?.email || "",
      }));
    }
  }, [session]);

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

  const onPickDeck = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadErr("");
    const lower = file.name.toLowerCase();
    if (!DECK_EXT.some((ext) => lower.endsWith(ext))) {
      setUploadErr("Please upload a PDF or PowerPoint (.pdf, .ppt, .pptx).");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (file.size > MAX_DECK_MB * 1024 * 1024) {
      setUploadErr(`That file is over ${MAX_DECK_MB} MB. Compress it, or paste a link instead.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setUploading(true);
    try {
      const { upload } = await import("@vercel/blob/client");
      const blob = await upload(`decks/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        contentType: file.type || undefined,
      });
      setDeck({ url: blob.url, name: file.name });
    } catch (err) {
      setUploadErr(
        err instanceof Error && err.message
          ? err.message
          : "Upload didn't work. Please paste a link to your deck instead."
      );
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      setUploading(false);
    }
  };

  const clearDeck = () => {
    setDeck(null);
    setUploadErr("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!teamName.trim() || !institution.trim() || !lead.name.trim() || !lead.email.trim()) {
      setError("Please fill in your team name, institution, and team-lead name & email.");
      return;
    }
    if (!approach.trim()) {
      setError("Please tell us your approach — how you plan to build your project.");
      return;
    }
    if (!repo.trim()) {
      setError("Please add your project's GitHub repository link.");
      return;
    }
    if (!deck && !deckLink.trim()) {
      setError("Please share your pitch deck — upload a file or paste a link.");
      return;
    }
    if (uploading) {
      setError("Please wait for your deck to finish uploading.");
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
          projectTitle,
          approach,
          repo,
          deckUrl: deck?.url || "",
          deckName: deck?.name || "",
          deckLink,
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
        <h2 className="h2">Team registered!</h2>
        <p className="lead">
          Team <strong>{teamName}</strong> is in for Git With Her — your registration id is{" "}
          <strong>{regId}</strong>. We&apos;ll review all entries and email the shortlisted teams at{" "}
          <strong>{lead.email}</strong> with the next steps.
        </p>
        <a href="/git-with-her" className="btn btn-primary">
          Back to the hackathon <span className="arw">→</span>
        </a>
      </div>
    );
  }

  return (
    <form className="reg-form" onSubmit={submit} noValidate>
      <p className="reg-info">
        We&apos;ll <strong>shortlist teams</strong> and email the
        selected ones with the next steps.
      </p>

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
            <span>Team size (min 2, max 4)</span>
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

      {/* Project — shortlisting phase */}
      <div className="reg-section">
        <h3 className="reg-legend">Your project</h3>
        <p className="reg-hint">
          This is how we shortlist. Tell us what you&apos;re building, how you&apos;ll do it, and
          share your GitHub repo and a pitch deck. You can keep working on all of it after you register.
        </p>

        <div className="reg-row">
          <label className="reg-field">
            <span>Project / idea title</span>
            <input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="e.g. GreenRoute — carbon-smart commutes" />
          </label>
          <label className="reg-field">
            <span>Project GitHub repo *</span>
            <input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="github.com/team/project" required />
          </label>
        </div>

        <label className="reg-field">
          <span>Your approach — how you&apos;ll build it *</span>
          <textarea
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
            rows={5}
            placeholder="What problem you're solving, your idea, the tech stack you'll use, and how you plan to build it during the hackathon."
            required
          />
        </label>

        <div className="reg-field">
          <span>Pitch deck / presentation *</span>
          <p className="reg-subhint">
            Your deck (PPT or PDF) should cover: the <strong>problem statement</strong> you&apos;re
            solving, <strong>how you&apos;ll solve it</strong>, your <strong>tech stack</strong>, and
            your build plan.
          </p>
          <div className="reg-deck">
            {deck ? (
              <div className="reg-deck-file">
                <span className="reg-deck-ico" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />
                  </svg>
                </span>
                <a className="reg-deck-name" href={deck.url} target="_blank" rel="noopener noreferrer">{deck.name}</a>
                <button type="button" className="reg-deck-x" onClick={clearDeck} aria-label="Remove file">✕</button>
              </div>
            ) : (
              <label className={`reg-upload${uploading ? " is-busy" : ""}`}>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.ppt,.pptx,.odp,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  onChange={onPickDeck}
                  disabled={uploading}
                />
                <span className="reg-upload-ico" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" />
                  </svg>
                </span>
                <span className="reg-upload-txt">
                  {uploading ? "Uploading…" : "Upload PDF or PowerPoint"}
                  <small>Max {MAX_DECK_MB} MB · .pdf, .ppt, .pptx</small>
                </span>
              </label>
            )}
          </div>
          {uploadErr && <p className="reg-error reg-deck-err">{uploadErr}</p>}
        </div>

        <label className="reg-field">
          <span>…or paste a deck link (Google Slides, Drive, Figma)</span>
          <input value={deckLink} onChange={(e) => setDeckLink(e.target.value)} placeholder="https://…" />
        </label>
      </div>

      <label className="reg-agree">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>
          We agree to the Catalyst code of conduct and confirm all members are women.
        </span>
      </label>

      {error && <p className="reg-error">{error}</p>}

      <button className="btn btn-primary reg-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "Register team"} <span className="arw">→</span>
      </button>
    </form>
  );
}
