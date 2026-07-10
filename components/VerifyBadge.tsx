"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyBadge({
  verified,
  emailEnabled = true,
}: {
  verified: boolean;
  emailEnabled?: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "verifying">("idle");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  if (verified) {
    return <span className="verify-badge ok">✓ Email verified</span>;
  }

  // email not wired up yet — show the status without a dead-end button
  if (!emailEnabled) {
    return <span className="verify-badge">Email not verified</span>;
  }

  const send = async () => {
    setError("");
    setMsg("");
    setState("sending");
    try {
      const res = await fetch("/api/verify/send", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setState("idle");
        setError(data.error || "Couldn't send the code.");
        return;
      }
      if (data.alreadyVerified) {
        router.refresh();
        return;
      }
      setState("sent");
      setMsg(
        data.sent
          ? "We emailed you a 6-digit code. Enter it below."
          : data.devCode
            ? `Test code: ${data.devCode}`
            : "Enter your code below."
      );
      if (data.devCode) setCode(data.devCode);
    } catch {
      setState("idle");
      setError("Couldn't send the code. Please try again.");
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setState("verifying");
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setState("sent");
        setError(data.error || "Invalid code.");
        return;
      }
      router.refresh();
    } catch {
      setState("sent");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="verify-box">
      {state === "idle" && (
        <div className="verify-row">
          <span className="verify-badge">Email not verified</span>
          <button type="button" className="verify-btn" onClick={send}>
            Verify email →
          </button>
        </div>
      )}
      {state === "sending" && <span className="verify-badge">Sending…</span>}
      {(state === "sent" || state === "verifying") && (
        <form className="verify-form" onSubmit={verify}>
          {msg && <p className="verify-msg">{msg}</p>}
          <div className="verify-row">
            <input
              className="verify-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
              inputMode="numeric"
              maxLength={6}
            />
            <button className="btn btn-primary" type="submit" disabled={state === "verifying"}>
              {state === "verifying" ? "Verifying…" : "Verify"}
            </button>
            <button type="button" className="verify-resend" onClick={send}>
              Resend
            </button>
          </div>
        </form>
      )}
      {error && <p className="reg-error">{error}</p>}
    </div>
  );
}
