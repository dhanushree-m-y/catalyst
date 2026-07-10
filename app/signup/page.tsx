import type { Metadata } from "next";
import AuthSlider from "@/components/AuthSlider";
import AuthDecor from "@/components/AuthDecor";
import CursorGlow from "@/components/CursorGlow";

export const metadata: Metadata = {
  title: "Create an account — Catalyst",
  description: "Create a Catalyst account to join the community and register for events.",
};

export default function SignupPage() {
  return (
    <main className="auth-stage">
      <AuthDecor />
      <a href="/" className="auth-home">
        <span className="auth-home-mark">✦</span> Catalyst
      </a>
      <AuthSlider
        initialMode="signup"
        googleEnabled={!!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET}
      />
      <a href="/" className="auth-back">
        ← Back to home
      </a>
      <CursorGlow />
    </main>
  );
}
