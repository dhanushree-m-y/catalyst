import type { Metadata } from "next";
import AuthPanel from "@/components/AuthPanel";
import CursorGlow from "@/components/CursorGlow";

export const metadata: Metadata = {
  title: "Create an account — Catalyst",
  description: "Create a Catalyst account to join the community and register for events.",
};

const social = {
  google: !!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET,
  github: !!process.env.AUTH_GITHUB_ID && !!process.env.AUTH_GITHUB_SECRET,
  linkedin: !!process.env.AUTH_LINKEDIN_ID && !!process.env.AUTH_LINKEDIN_SECRET,
};

export default function SignupPage() {
  return (
    <main className="auth-stage">
      <AuthPanel initialMode="signup" social={social} />
      <CursorGlow />
    </main>
  );
}
