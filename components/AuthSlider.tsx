"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.3C41.4 36 44 30.5 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
);

function dest() {
  if (typeof window === "undefined") return "/account";
  return new URLSearchParams(window.location.search).get("callbackUrl") || "/account";
}

export default function AuthSlider({
  initialMode = "signin",
  googleEnabled = false,
}: {
  initialMode?: "signin" | "signup";
  googleEnabled?: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  // sign in
  const [inEmail, setInEmail] = useState("");
  const [inPass, setInPass] = useState("");
  // sign up
  const [name, setName] = useState("");
  const [upEmail, setUpEmail] = useState("");
  const [upPass, setUpPass] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const google = () => {
    setBusy(true);
    signIn("google", { callbackUrl: dest() });
  };

  const doSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!inEmail.trim() || !inPass) {
      setError("Please enter your email and password.");
      return;
    }
    setBusy(true);
    const res = await signIn("credentials", { email: inEmail, password: inPass, redirect: false });
    if (res?.error) {
      setBusy(false);
      setError("That email or password doesn't match.");
      return;
    }
    router.push(dest());
    router.refresh();
  };

  const doSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !upEmail.trim() || !upPass) {
      setError("Please fill in your name, email and a password.");
      return;
    }
    if (upPass.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: upEmail, password: upPass }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      const login = await signIn("credentials", { email: upEmail, password: upPass, redirect: false });
      if (login?.error) {
        router.push("/login");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const toSignup = () => {
    setError("");
    setMode("signup");
  };
  const toSignin = () => {
    setError("");
    setMode("signin");
  };

  return (
    <div className={`auth-slider${mode === "signup" ? " right-panel-active" : ""}`}>
      {/* Sign up */}
      <div className="auth-pane sign-up-container">
        <form onSubmit={doSignUp} noValidate>
          <h1>Create account</h1>
          {googleEnabled && (
            <>
              <div className="auth-social">
                <button type="button" onClick={google} aria-label="Sign up with Google">
                  <GoogleIcon />
                </button>
              </div>
              <span className="auth-hint">or use your email to register</span>
            </>
          )}
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" autoComplete="name" />
          <input type="email" value={upEmail} onChange={(e) => setUpEmail(e.target.value)} placeholder="Email" autoComplete="email" />
          <input type="password" value={upPass} onChange={(e) => setUpPass(e.target.value)} placeholder="Password (8+ characters)" autoComplete="new-password" />
          {mode === "signup" && error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" type="submit" disabled={busy}>
            {busy ? "Please wait…" : "Sign up"}
          </button>
          <p className="auth-switch-m">
            Already have an account?{" "}
            <button type="button" onClick={toSignin}>
              Sign in
            </button>
          </p>
        </form>
      </div>

      {/* Sign in */}
      <div className="auth-pane sign-in-container">
        <form onSubmit={doSignIn} noValidate>
          <h1>Sign in</h1>
          {googleEnabled && (
            <>
              <div className="auth-social">
                <button type="button" onClick={google} aria-label="Sign in with Google">
                  <GoogleIcon />
                </button>
              </div>
              <span className="auth-hint">or use your email &amp; password</span>
            </>
          )}
          <input type="email" value={inEmail} onChange={(e) => setInEmail(e.target.value)} placeholder="Email" autoComplete="email" />
          <input type="password" value={inPass} onChange={(e) => setInPass(e.target.value)} placeholder="Password" autoComplete="current-password" />
          {mode === "signin" && error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" type="submit" disabled={busy}>
            {busy ? "Please wait…" : "Sign in"}
          </button>
          <p className="auth-switch-m">
            New to Catalyst?{" "}
            <button type="button" onClick={toSignup}>
              Create an account
            </button>
          </p>
        </form>
      </div>

      {/* Sliding overlay */}
      <div className="auth-overlay-container">
        <div className="auth-overlay">
          <div className="auth-overlay-panel auth-overlay-left">
            <h1>Welcome back!</h1>
            <p>Log in to pick up where you left off with the Catalyst community.</p>
            <button type="button" className="btn-ghost-white" onClick={toSignin}>
              Sign in
            </button>
          </div>
          <div className="auth-overlay-panel auth-overlay-right">
            <h1>Hello, builder!</h1>
            <p>Create an account to join Catalyst and register for Git With Her.</p>
            <button type="button" className="btn-ghost-white" onClick={toSignup}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
