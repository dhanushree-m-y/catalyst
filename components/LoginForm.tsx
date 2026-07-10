"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function dest() {
  if (typeof window === "undefined") return "/account";
  return new URLSearchParams(window.location.search).get("callbackUrl") || "/account";
}

export default function LoginForm({ googleEnabled = false }: { googleEnabled?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "google">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setStatus("submitting");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setStatus("idle");
      setError("That email or password doesn't match. Please try again.");
      return;
    }
    router.push(dest());
    router.refresh();
  };

  return (
    <div className="auth-card">
      {googleEnabled && (
        <>
          <button
            type="button"
            className="btn btn-google"
            disabled={status !== "idle"}
            onClick={() => {
              setStatus("google");
              signIn("google", { callbackUrl: dest() });
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.3C41.4 36 44 30.5 44 24c0-1.3-.1-2.3-.4-3.5z" />
            </svg>
            Continue with Google
          </button>
          <div className="auth-or"><span>or</span></div>
        </>
      )}

      <form className="reg-form auth-form" onSubmit={submit} noValidate>
        <label className="reg-field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label className="reg-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="reg-error">{error}</p>}

        <button className="btn btn-primary reg-submit" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Logging in…" : "Log in"} <span className="arw">→</span>
        </button>
      </form>

      <p className="auth-switch">
        New here? <a href="/signup">Create an account</a>
      </p>
    </div>
  );
}
