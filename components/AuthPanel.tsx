"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Flower from "@/components/Flower";

type Social = { google?: boolean; github?: boolean; linkedin?: boolean };

function dest() {
  if (typeof window === "undefined") return "/account";
  return new URLSearchParams(window.location.search).get("callbackUrl") || "/account";
}

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M4 7l8 5 8-5" />
  </svg>
);
const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 018 0v3" />
  </svg>
);
const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20a8 8 0 0116 0" />
  </svg>
);
const EyeIcon = ({ off }: { off?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M3 3l18 18" />}
  </svg>
);
const GoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.3C41.4 36 44 30.5 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
);
const GithubMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#24292f">
    <path d="M12 1C5.9 1 1 5.9 1 12c0 4.9 3.2 9 7.5 10.5.5.1.7-.2.7-.5v-1.7c-3 .7-3.7-1.4-3.7-1.4-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.4-.3-4.9-1.2-4.9-5.3 0-1.2.4-2.1 1.1-2.9-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 3 1.1.9-.2 1.8-.4 2.7-.4.9 0 1.8.1 2.7.4 2.1-1.4 3-1.1 3-1.1.6 1.4.2 2.5.1 2.8.7.8 1.1 1.7 1.1 2.9 0 4.1-2.5 5-4.9 5.3.4.3.7 1 .7 2v3c0 .3.2.6.7.5C19.8 21 23 16.9 23 12c0-6.1-4.9-11-11-11z" />
  </svg>
);
const LinkedinMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M4.98 3.5A2.5 2.5 0 100 3.51a2.5 2.5 0 004.98-.01zM.24 8.02h4.48V24H.24V8.02zM8.34 8.02h4.29v2.18h.06c.6-1.13 2.06-2.32 4.24-2.32 4.53 0 5.37 2.98 5.37 6.86V24h-4.48v-6.36c0-1.52-.03-3.47-2.12-3.47-2.12 0-2.45 1.66-2.45 3.36V24H8.34V8.02z" />
  </svg>
);

export default function AuthPanel({
  initialMode = "signin",
  social = {},
}: {
  initialMode?: "signin" | "signup";
  social?: Social;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  const oauth = (provider: "google" | "github" | "linkedin") => {
    if (!social[provider]) {
      setError(
        `${provider[0].toUpperCase() + provider.slice(1)} sign-in is being set up — please use your email for now.`
      );
      return;
    }
    setBusy(true);
    signIn(provider, { callbackUrl: dest() });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isSignup) {
      if (!name.trim() || !email.trim() || !password) {
        setError("Please fill in your name, email and a password.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      setBusy(true);
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
        const login = await signIn("credentials", { email, password, redirect: false });
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
    } else {
      if (!email.trim() || !password) {
        setError("Please enter your email and password.");
        return;
      }
      setBusy(true);
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setBusy(false);
        setError("That email or password doesn't match.");
        return;
      }
      router.push(dest());
      router.refresh();
    }
  };

  const toggle = () => {
    setError("");
    setMode(isSignup ? "signin" : "signup");
  };

  return (
    <div className="authx">
      {/* LEFT — branding */}
      <div className="authx-left">
        <Flower className="authx-flower af1" />
        <Flower className="authx-flower af2" />
        <a href="/" className="authx-brand">
          <span className="authx-spark">✦</span>
          <span>
            <span className="authx-word">Catalyst</span>
            <span className="authx-tag">A space for women to grow</span>
          </span>
        </a>

        <div className="authx-hero">
          <h1>{isSignup ? "Hello, builder!" : "Welcome back!"}</h1>
          <p>
            {isSignup
              ? "Create your account and start building with the Catalyst community."
              : "Log in to continue your journey with Catalyst."}
          </p>
          <p className="authx-about">
            Catalyst is a community for women across every field — a space to learn,
            build and grow together, and home to <strong>Git With Her</strong>, our
            flagship all-women hackathon.
          </p>
        </div>

        <div className="authx-stats">
          <div><b>500+</b><span>Members</span></div>
          <div><b>30+</b><span>Teams</span></div>
          <div><b>₹50,000</b><span>Prizes</span></div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="authx-right">
        <div className="authx-form">
          <div className="authx-toggle">
            {isSignup ? "Already have an account?" : "New to Catalyst?"}{" "}
            <button type="button" onClick={toggle}>
              {isSignup ? "Log in" : "Create an account"} →
            </button>
          </div>

          <h2>{isSignup ? "Create your account" : "Log in to your account"}</h2>
          <p className="authx-sub">
            {isSignup ? "Enter your details to get started." : "Enter your details to access your dashboard."}
          </p>

          <form onSubmit={submit} noValidate>
            {isSignup && (
              <label className="authx-field">
                <span>Full name</span>
                <span className="authx-input">
                  <UserIcon />
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
                </span>
              </label>
            )}
            <label className="authx-field">
              <span>Email address</span>
              <span className="authx-input">
                <MailIcon />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" autoComplete="email" />
              </span>
            </label>
            <label className="authx-field">
              <span>Password</span>
              <span className="authx-input">
                <LockIcon />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                />
                <button type="button" className="authx-eye" onClick={() => setShowPass((s) => !s)} aria-label="Show password">
                  <EyeIcon off={showPass} />
                </button>
              </span>
            </label>

            {!isSignup && (
              <a className="authx-forgot" href="mailto:buildwithcatalyst@gmail.com?subject=Password%20reset">
                Forgot password?
              </a>
            )}

            {error && <p className="authx-error">{error}</p>}

            <button className="authx-submit" type="submit" disabled={busy}>
              {busy ? "Please wait…" : isSignup ? "Create account" : "Log in"} <span className="arw">→</span>
            </button>
          </form>

          <div className="authx-or"><span>or continue with</span></div>

          <div className="authx-social">
            <button type="button" onClick={() => oauth("google")}>
              <GoogleMark /> Continue with Google
            </button>
            <button type="button" onClick={() => oauth("github")}>
              <GithubMark /> Continue with GitHub
            </button>
            <button type="button" onClick={() => oauth("linkedin")}>
              <LinkedinMark /> Continue with LinkedIn
            </button>
          </div>

          <p className="authx-safe">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Your data is safe with us. We never share your information.
          </p>
        </div>
      </div>
    </div>
  );
}
