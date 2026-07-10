import type { Metadata } from "next";
import AuthSlider from "@/components/AuthSlider";

export const metadata: Metadata = {
  title: "Create an account — Catalyst",
  description: "Create a Catalyst account to join the community and register for events.",
};

export default function SignupPage() {
  return (
    <main className="auth-stage">
      <a href="/" className="auth-home">
        <span className="auth-home-mark">✦</span> Catalyst
      </a>
      <AuthSlider
        initialMode="signup"
        googleEnabled={!!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET}
      />
    </main>
  );
}
